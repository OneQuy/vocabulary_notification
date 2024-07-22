// Created 22 July 2024 (coding Vocaby)

import { FirebaseDatabaseTimeOutMs } from "./Firebase/FirebaseDatabase";
import { GetAlternativeConfig } from "./RemoteConfig";
import { AlertAsync, FetchWithTimeoutAsync, IsNumType, NoCacheHeaders, ToCanPrintError } from "./UtilsTS";

const IsLog = true

const GetInternetTimeError = new Error('Can not fetch time.')

const DefaultUrl = 'https://www.microsoft.com'

export class InternetTime {
    static async GetInternetTimeAsync(): Promise<number | Error> {
        try {
            const url = GetAlternativeConfig('internetTimeUrl', DefaultUrl)

            const res = await FetchWithTimeoutAsync(url, FirebaseDatabaseTimeOutMs, NoCacheHeaders)

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
            // console.log('url', url)

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
                    console.log('[InternetTime-LoopFetchTillSucessAsync] SUCCESS', value)

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