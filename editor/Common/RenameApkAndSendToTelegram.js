const { ReadFileJsonAsync } = require("./FileUtils");
const { UploadFileToTelegramBot } = require("./TelegramBotFileUpload");

const RenameFileApkAndSendToTelegramAsync = async () => {
    const cur = process.cwd()

    const packageFile = `${cur}//package.json`

    var jsonObj = await ReadFileJsonAsync(packageFile);

    if (jsonObj === undefined) {
        return
    }

    const newfileName = `${jsonObj.name.replaceAll(' ', '_')}_${jsonObj.version.replaceAll('.', '')}.apk`

    const flp = `${cur}//android//app//build//outputs//apk//release//app-release.apk`

    // flp = await RenameFileAsync(flp, newfileName)

    // if (!flp)
    //     return;

    UploadFileToTelegramBot(
        '6400751952:AAFL0L94MTUNSUHakZkcjbMk3vJMpfGSTIg',
        flp,
        '1978471835',
        newfileName
    )
}

RenameFileApkAndSendToTelegramAsync()

module.exports = {
    RenameFileApkAndSendToTelegramAsync,
}