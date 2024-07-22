import { FirebaseDatabaseTimeOutMs } from "./Firebase/FirebaseDatabase";
import { FetchWithTimeoutAsync } from "./UtilsTS";

const GetInternetTimeError = new Error('Can not fetch time.')

const DefaultUrl = 'https://www.microsoft.com'

export async function GetInternetTimeAsync(url?: string): Promise<number | Error> {
    try {
        const res = await FetchWithTimeoutAsync(url ?? DefaultUrl, FirebaseDatabaseTimeOutMs)

        if (res?.status !== 200) {
            return GetInternetTimeError
        }

        const dateString = res?.headers?.get('Date');

        if (!dateString)
            return GetInternetTimeError

        const parse = Date.parse(dateString)

        // console.log(typeof dateString, dateString)
        // console.log(typeof parse, parse)

        return parse
    }
    catch (e) {
        return GetInternetTimeError
    }
}