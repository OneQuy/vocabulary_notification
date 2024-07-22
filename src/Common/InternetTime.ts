import { FirebaseDatabaseTimeOutMs } from "./Firebase/FirebaseDatabase";
import { GetAlternativeConfig } from "./RemoteConfig";
import { FetchWithTimeoutAsync } from "./UtilsTS";

const GetInternetTimeError = new Error('Can not fetch time.')

const DefaultUrl = 'https://www.microsoft.com'

export async function GetInternetTimeAsync(): Promise<number | Error> {
    try {
        const url = GetAlternativeConfig('internetTimeUrl', DefaultUrl)

        const res = await FetchWithTimeoutAsync(url, FirebaseDatabaseTimeOutMs)

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