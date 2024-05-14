import { useEffect, useState } from 'react'
import { StorageKey_LifetimeID } from '../Constants/StorageKey'
import AsyncStorage from '@react-native-async-storage/async-storage'

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