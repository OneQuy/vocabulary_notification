import { useEffect, useState } from 'react'
import { StorageKey_LifetimeID } from '../Constants/StorageKey'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IAPProduct } from '../../Common/IAP/IAP'

export const AllIAPProducts: IAPProduct[] = [
    {
        sku: 'vocaby_lifetime',
        isConsumable: true,
    },
    {
        sku: 'vocaby_lifetime_pro',
        isConsumable: true,
    },
    {
        sku: 'vocaby_lifetime_max',
        isConsumable: true,
    },
]

const usePremium = () => {
    const [lifetimeID, set_lifetimeID] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            const id = await AsyncStorage.getItem(StorageKey_LifetimeID)
            set_lifetimeID(id)
        })()
    }, [])

    return {
        isLifetime: lifetimeID !== null,
        set_lifetimeID
    }
}

export default usePremium