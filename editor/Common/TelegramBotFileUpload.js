// Doc Telegram: https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md

const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config()

const fs = require('fs');

/**
 ## Install:
 npm i --save-dev node-telegram-bot-api

 ## Usage example:
 ```tsx
 UploadTelegramBot("1234567890:AAFL0L9Mk3vxxxxx", "E:\folder\file.txt", "1234567890", "alias.txt")
 ```
 
 * @param {*} token How to get token: create bot be search ``@BotFather`` on Telegram.
 * @param {*} filepath full local file path.
 * @param {*} chatId How to get chatId: run UploadTelegramBot(yourToken, undefined, undefined, undefined). Then chat anything in your bot to get it.
 * @param fileNameWithExt if you want to replace the file name
 */
const UploadFileToTelegramBot = async (token, filepath, chatId, fileNameWithExt) => {
    if (!token) {
        console.error('[UploadTelegramBot] Token is undefined')
        process.exit()
    }

    // Create a bot that uses 'polling' to fetch new updates

    const bot = new TelegramBot(token, { polling: true });

    bot.on('polling_error', (error) => {
        const msg = error?.message

        if (msg === 'ETELEGRAM: 401 Unauthorized')
            console.error('[UploadTelegramBot] Maybe your token is invalid. ' + error)
        else
            console.error('[UploadTelegramBot] Polling error. ' + error)

        process.exit()
    });

    const { name: botname } = await bot.getMyName()

    // Listen for any kind of message. There are different kinds of messages.

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, 'Chat ID: ' + chatId);

        // bot.sendMessage(chatId, 'Chat:\n\n' + JSON.stringify(msg, null, 1));
    });

    if (!chatId) {
        console.error(`[UploadTelegramBot] Invalid chatId. Chat anything to the bot '${botname}' to get it.`)

        return;
    }

    if (!fs.existsSync(filepath)) {
        console.error('[UploadTelegramBot] Not found file: ' + filepath)
        process.exit()
    }

    console.log(`[UploadTelegramBot] Sending file ${fileNameWithExt ?? ''} to bot '${botname}'`)

    // Read the file as a stream

    const fileStream = fs.createReadStream(filepath);

    // Send the file

    const fileOptions = {
        // Explicitly specify the file name.
        filename: fileNameWithExt ?? undefined,
        // Explicitly specify the MIME type.
        contentType: 'application/octet-stream',
    };

    bot.sendDocument(chatId, fileStream, {}, fileOptions)
        .then(() => {
            console.log(`[UploadTelegramBot] File sent to bot '${botname}' successfully: ${fileNameWithExt ?? filepath}`)
            process.exit()
        })
        .catch((error) => {
            console.error('[UploadTelegramBot] Error sending file:', error);
            process.exit()
        })
}

module.exports = {
    UploadFileToTelegramBot
}