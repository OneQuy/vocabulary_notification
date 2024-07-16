/**
 * SETUP
 * 1. Like this: https://github.com/OneQuy/HealYourSoul/commit/614b9d3a2ae4e6c2928569d94ab32633ce3c7d14
 * 2. Add IAP in XCode
 * 3. Add this to android manifest: <uses-permission android:name="com.android.vending.BILLING" />
 * 4. Done!
 * 
 * DOC
 * https://react-native-iap.dooboolab.com/docs/get-started
 * 
 * USAGE: should call this first:
        await InitIAPAsync(...)
 */


import { Platform } from 'react-native';
import {
    initConnection,
    purchaseUpdatedListener,
    type ProductPurchase,
    type PurchaseError,
    flushFailedPurchasesCachedAsPendingAndroid,
    SubscriptionPurchase,
    finishTransaction,
    requestPurchase,
    getProducts,
    Product,
    ErrorCode,
    getAvailablePurchases,
    Purchase,
} from 'react-native-iap';
import { CalculateSalePercentage, CreateError, IsValuableArrayOrString, SafeGetArrayElement, SplitNumberInText, ToCanPrint } from '../UtilsTS'
import { Cheat } from '../Cheat';

export type IAPProduct = {
    sku: string,
    isConsumable: boolean,
    displayName?: string,
}

var cachedProductsSetterAsync: ((text: string) => Promise<void>) | undefined = undefined
var cachedProductsGetterAsync: (() => Promise<string | null>) | undefined = undefined

var isInited = false
var initedProducts: IAPProduct[]

var fetchedProductsFromCached: Product[] | undefined = undefined

var fetchedProducts: Product[] = []

/**
 * @returns success: return undefined
 * @returns failed: new Error('...')
 * 
 * ### USAGE
 * ```tsx
        await InitIAPAsync(
            ids.map(i => i.product),
            async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
            async () => AsyncStorage.getItem(StorageKey_CachedIAP))
 * ```
 */
export const InitIAPAsync = async (
    products: IAPProduct[],
    cachedProductsListSetterAsync?: (text: string) => Promise<void>,
    cachedProductsListGetterAsync?: () => Promise<string | null>,
): Promise<Error | undefined> => {
    if (isInited) {
        return undefined
    }

    const canIAP = await initConnection()

    if (!canIAP) {
        return new Error('[IAP] can not initConnection')
    }

    isInited = true
    initedProducts = products

    cachedProductsSetterAsync = cachedProductsListSetterAsync
    cachedProductsGetterAsync = cachedProductsListGetterAsync

    await LoadFetchedProductsFromCachedAsync()

    // (only android) we make sure that "ghost" pending payment are removed
    // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)

    if (Platform.OS === 'android') {
        try {
            await flushFailedPurchasesCachedAsPendingAndroid()
        } catch (error) {
            // exception can happen here if:
            // - there are pending purchases that are still pending (we can't consume a pending purchase)
            // in any case, you might not want to do anything special with the error
            console.error('IAP flushFailedPurchasesCachedAsPendingAndroid error: ' + error);
        }
    }

    // purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
    //     const receipt = purchase?.transactionReceipt

    //     // console.log('receipt', receipt);

    //     if (!receipt) {
    //         return
    //     }

    //     // Tell the store that you have delivered what has been paid for.
    //     // Failure to do this will result in the purchase being refunded on Android and
    //     // the purchase event will reappear on every relaunch of the app until you succeed
    //     // in doing the below. It will also be impossible for the user to purchase consumables
    //     // again until you do this.

    //     const product = products?.find(i => i.sku === purchase.productId)

    //     if (!product) {
    //         // throw new Error('IAP not found product: ' + purchase.productId)
    //         console.error('[purchaseUpdatedListener] IAP not found product: ' + purchase.productId)
    //     }
    //     else {
    //         finishTransaction({ purchase, isConsumable: product.isConsumable })
    //     }
    // })

    return undefined
}

const LoadFetchedProductsFromCachedAsync = async (): Promise<Product[]> => {
    if (fetchedProductsFromCached !== undefined)
        return fetchedProductsFromCached

    if (typeof cachedProductsGetterAsync === 'function') {
        const s = await cachedProductsGetterAsync()

        if (s && s.length > 0)
            fetchedProductsFromCached = JSON.parse(s) as Product[]
    }

    if (!fetchedProductsFromCached)
        fetchedProductsFromCached = []

    return fetchedProductsFromCached
}

// const GetIAPProductFromCachedAsync = async (sku: string): Promise<Product | undefined> => {
//     await LoadFetchedProductsFromCachedAsync()

//     if (fetchedProductsFromCached)
//         return fetchedProductsFromCached.find(i => i.productId == sku)
//     else
//         return undefined
// }

// const GetIAPProduct = async (sku: string): Promise<Product | undefined> => {
//     if (!isInited)
//         throw new Error('IAP not inited yet')

//     const products = await getProducts({ skus: [sku] })

//     if (!products || products.length < 1)
//         return await GetIAPProductFromCachedAsync(sku)

//     return products[0]
// }

// export const GetIAPLocalPriceAsync = async (sku: string): Promise<string | undefined> => {
//     const product = await GetIAPProduct(sku)

//     if (product)
//         return product.localizedPrice
//     else
//         return undefined
// }

export const FetchListProductsAsync = async (skus: string[]) => {
    if (fetchedProducts.length > 0) // already fetched
        return fetchedProducts

    if (!isInited)
        throw new Error('IAP not inited yet')

    fetchedProducts = await getProducts({ skus })

    if (fetchedProducts && fetchedProducts.length > 0) { // loaded from store success, cached them
        if (typeof cachedProductsSetterAsync === 'function') {
            cachedProductsSetterAsync(JSON.stringify(fetchedProducts))
        }
    }
    else { // load fail, need to load from cached
        fetchedProducts = await LoadFetchedProductsFromCachedAsync()
    }

    return fetchedProducts
}

/**
 * @returns undefined if success
 * @returns null if user cancelled
 * @returns otherwise Error
 */
// export const PurchaseAsync = async (sku: string) => {
//     if (Cheat('force_iap_success'))
//         return undefined

//     try {
//         if (!isInited)
//             return new Error('[PurchaseAsync] IAP not inited yet')

//         if (Platform.OS === 'android' && fetchedProducts.length <= 0) { // need to fetch on android
//             await FetchListProductsAsync(initedProducts.map(i => i.sku))
//         }

//         const res = await requestPurchase({
//             sku,
//             skus: [sku],
//             andDangerouslyFinishTransactionAutomaticallyIOS: false,
//         })

//         if (typeof res === 'object') {
//             let successProduct: ProductPurchase | undefined = undefined

//             if (Array.isArray(res)) {
//                 successProduct = SafeGetArrayElement<ProductPurchase>(res)
//             }
//             else
//                 successProduct = res

//             if (successProduct && successProduct.productId === sku) // success
//                 return undefined
//             else // fail
//                 return new Error('[PurchaseAsync] Invalid product: ' + sku + ', response: ' + ToCanPrint(res))
//         }
//         else
//             return new Error('[PurchaseAsync] Invalid response: ' + sku + ', response: void')
//     } catch (err) {
//         const errIAP = err as PurchaseError

//         if (errIAP && errIAP.code === ErrorCode.E_USER_CANCELLED)
//             return null
//         else
//             return err
//     }
// }

/**
 * @returns success: Purchase[] if  (can be empty []), 
 * @returns error: Error()
 * @returns user canceled: null
 */
export const RestorePurchaseAsync = async (): Promise<Purchase[] | Error | null> => {
    try {
        if (!isInited)
            return new Error('IAP not inited yet')

        const purchases = await getAvailablePurchases();

        for (let i = 0; i < purchases.length; i++) {
            const purchase = purchases[i]
            const product = initedProducts.find(i => i.sku === purchase.productId)

            if (!product)
                continue

            if (!product.isConsumable)
                continue

            await finishTransaction({ purchase });
        }

        return purchases
    } catch (error) {
        // @ts-ignore
        if (error && error.code === 'E_USER_CANCELLED')
            return null
        else
            return CreateError(error)
    }
}

const GetPriceOfProduct = (product: Product) => {
    const priceOrNaN = SplitNumberInText(product.price)

    // console.log(SplitNumberInText('đ260,000'));
    // console.log(SplitNumberInText('9.99'));

    return priceOrNaN
}

export const GetPercentDiscountTxtAndOriginLocalizedPriceTxt = (
    originProduct: IAPProduct,
    currentProduct?: IAPProduct,
    fetchedProducts?: Product[],
) => {
    if (!currentProduct ||
        currentProduct.sku === originProduct.sku ||
        !IsValuableArrayOrString(fetchedProducts)
    ) {
        return
    }

    const fetchedCurrent = fetchedProducts.find(iap => iap.productId === currentProduct.sku)

    if (!fetchedCurrent)
        return

    const fetchedOrigin = fetchedProducts.find(iap => iap.productId === originProduct.sku)

    if (!fetchedOrigin)
        return

    const priceOriginOrNaN = GetPriceOfProduct(fetchedOrigin)

    const localPriceOrigin = fetchedOrigin.localizedPrice

    const currentPriceOrNaN = GetPriceOfProduct(fetchedCurrent)

    if (isNaN(priceOriginOrNaN) || isNaN(currentPriceOrNaN))
        return

    const percent = CalculateSalePercentage(priceOriginOrNaN, currentPriceOrNaN)

    // console.log(percent, priceOriginOrNaN, currentPriceOrNaN)

    return {
        /**
         * string [0-100]
         */
        percentDiscountTxt: percent.toFixed(),

        originLocalizedPriceTxt: localPriceOrigin,
    }
}



// export const RegisterOnSuccessPurchase = (calback: SuccessCallback) => {
//     onSuccessListeners.push(calback)
// }

// export const UnregisterOnSuccessPurchase = (calback: SuccessCallback) => {
//     ArrayRemove(onSuccessListeners, calback)
// }

// export const RegisterOnErrorPurchase = (calback: ErrorCallback) => {
//     onErrorListeners.push(calback)
// }

// export const UnregisterOnErrorPurchase = (calback: ErrorCallback) => {
//     ArrayRemove(onErrorListeners, calback)
// }