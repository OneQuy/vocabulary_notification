import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FetchListProductsAsync, IAPProduct, InitIAPAsync } from "./IAP"
import { Product } from "react-native-iap"

/**
 * 
 * ## Usage
 * 1.
 ```tsx
const { isReadyPurchase, fetchedProducts } = useMyIAP(
    allProducts,
    async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
    async () => AsyncStorage.getItem(StorageKey_CachedIAP))
```

 * 2. if isReadyPurchase === true, you can purchase anything now.
 * 3. when isReadyToPurchase === false: 
 *  + if initErrorObj !== undefinded means error inited (maybe no support device)
 *  + if initErrorObj === undefinded means initing
 * 4. use in return:
 *      + fetchedProducts
 *      + fetchedTargetProduct of targetProductSku
 *      + localPrice of targetProductSku
 */
export const useMyIAP = (
    allProducts: IAPProduct[],
    cachedProductsListSetterAsync?: (text: string) => Promise<void>,
    cachedProductsListGetterAsync?: () => Promise<string | null>,
    targetProductSku?: IAPProduct | string,
) => {
    const [fetchedProducts, setFetchedProducts] = useState<Product[]>([])
    const [isReadyPurchase, setIsReadyPurchase] = useState(false)
    const [initErrorObj, setInitErroObj] = useState<Error | undefined>(undefined)
    const fetchTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

    const fetchedTargetProduct = useMemo(() => {
        if (targetProductSku === undefined)
            return undefined

        if (fetchedProducts.length === 0)
            return undefined

        if (typeof targetProductSku === 'string')
            return fetchedProducts.find(i => i.productId === targetProductSku)
        else
            return fetchedProducts.find(i => i.productId === targetProductSku.sku)
    }, [fetchedProducts, targetProductSku])

    const fetchListProducts = useCallback(async () => {
        const items = await FetchListProductsAsync(allProducts.map(i => i.sku))

        if (items && items.length > 0)
            setFetchedProducts(items)
        else {
            fetchTimeout.current = setTimeout(fetchListProducts, 500)
        }
    }, [])

    useEffect(() => {
        (async () => {
            // init IAP

            const errorObj = await InitIAPAsync(
                allProducts,
                cachedProductsListSetterAsync,
                cachedProductsListGetterAsync)

            if (errorObj !== undefined) {
                setInitErroObj(errorObj)
                return
            }
            else // inited and no error => ready
                setIsReadyPurchase(true)

            // fetch local price

            fetchListProducts()
        })()

        return () => {
            clearTimeout(fetchTimeout.current)
        }
    }, [])

    return {
        fetchedProducts,
        fetchedTargetProduct,
        localPrice: fetchedTargetProduct ? fetchedTargetProduct.localizedPrice : undefined,
        isReadyPurchase,
        initErrorObj,
    } as const
}