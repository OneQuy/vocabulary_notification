// Usage: 
// 1. Go to https://www.ip2location.io/dashboard
// 2. Get free key
// 3. Fill key to below

import { IpLocationKey } from "../../../Keys"
import { GetIPAsync, ToCanPrint } from "../UtilsTS"

const key = IpLocationKey

export type IPLocation = {
    city_name: string,
    country_code: string,
    country_name: string,
    region_name: string,
}

/**
 * @returns IPLocation if success
 * @returns undefined if IP or response not ok
 * @returns string (ToCanPrint) if other error
 */
export const GetIPLocationAsync = async (): Promise<IPLocation | undefined | string> => {
    const ip = await GetIPAsync()

    if (typeof ip !== 'string')
        return undefined

    try {
        var myHeaders = new Headers();
        myHeaders.append("apikey", key)

        const url = `https://api.ip2location.io/?key=${key}&ip=${ip}&format=json`
        const res = await fetch(url)

        if (!res.ok)
            return undefined

        const result = await res.json()

        const json = {
            country_code: result.country_code,
            country_name: result.country_name,
            city_name: result.city_name,
            region_name: result.region_name,
        } as IPLocation

        // console.log(json);

        return json
    }
    catch (e) {
        return ToCanPrint(e).toString()
    }
}