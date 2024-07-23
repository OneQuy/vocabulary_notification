// Created 22 July 2024 (coding Vocaby)

import { FirebaseDatabaseTimeOutMs } from "./Firebase/FirebaseDatabase";
import { AlertAsync, DateDiff_InSeconds_WithNow, FetchWithTimeoutAsync, IsNumType, NoCacheHeaders, ToCanPrintError } from "./UtilsTS";

const IsLog = true

const GetInternetTimeError = new Error('Can not fetch time.')

const FetchUrls = [
    'https://www.google.com',
    'https://www.microsoft.com',
    'https://github.com',
    'https://currentmillis.com',
    'https://time.is',
]

export class InternetTime {
    static async GetInternetTimeAsync(): Promise<number | Error> {
        try {
            let res: Response | undefined
            let curUrl

            for (let url of FetchUrls) {
                curUrl = url

                res = await FetchWithTimeoutAsync(url, FirebaseDatabaseTimeOutMs, NoCacheHeaders)

                // console.log('fetching...', url);

                if (res !== undefined)
                    break
            }

            if (res?.status !== 200) {
                return GetInternetTimeError
            }

            const dateString = res?.headers?.get('Date');

            if (!dateString)
                return GetInternetTimeError

            const parse = Date.parse(dateString)

            // console.log('fetched', typeof dateString, dateString)
            // console.log('parsed', typeof parse, new Date(parse))
            // console.log('diff ms', Date.now() - parse)
            // console.log('success at url', curUrl)

            return parse
        }
        catch (e) {
            return GetInternetTimeError
        }
    }

    static LoopFetchTillSucessAsync = async (
        alertTitleErrorTxt = 'Error',
        alertContentErrorTxt = 'Can not fetch server time. Please check your internet and try again.',
        alertBtnRetryTxt = 'Retry',
    ): Promise<number> => {
        while (true) {
            const value = await this.GetInternetTimeAsync()

            if (IsNumType(value)) {
                if (IsLog)
                    console.log('[InternetTime-LoopFetchTillSucessAsync] SUCCESS', value, 'diff with local time in sec', DateDiff_InSeconds_WithNow(value))

                return value
            }
            else { // error => need to re-fetch
                if (IsLog)
                    console.log('[InternetTime-LoopFetchTillSucessAsync] FAIL', ToCanPrintError(value))

                await AlertAsync(
                    alertTitleErrorTxt,
                    alertContentErrorTxt,
                    alertBtnRetryTxt
                )
            }
        }
    }
}