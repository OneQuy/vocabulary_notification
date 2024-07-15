import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, PurchasesStoreProduct } from "react-native-purchases";
import { CreateError, ExecuteWithTimeoutAsync, SafeArrayLength, TimeOutErrorObject, ToCanPrint, ToCanPrintError, UnknownErrorObject } from "../UtilsTS";
import { RevenueCat_Android, RevenueCat_iOS } from "../../../Keys";
import { GetArrayAsync, SetArrayAsync } from "../AsyncStorageUtils";
import { StorageKey_RevenueCatPackages } from "../../App/Constants/StorageKey";
import { IAPProduct } from "../IAP/IAP";
import { FirebaseDatabaseTimeOutMs } from "../Firebase/FirebaseDatabase";
import { AllIAPProducts } from "../SpecificConstants";

const IsLog = __DEV__

const APIKeys = {
    apple: RevenueCat_iOS,
    google: RevenueCat_Android
};

export class RevenueCat {
    private static inited: boolean = false

    private static CheckInit() {
        if (this.inited)
            return

        if (IsLog) console.log('[RevenueCat] inited')

        this.inited = true

        if (Platform.OS === 'android') {
            Purchases.configure({ apiKey: APIKeys.google });
        } else {
            Purchases.configure({ apiKey: APIKeys.apple });
        }

        // Use more logging during debug if want!
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        // Listen for customer updates
        // Purchases.addCustomerInfoUpdateListener(async (info) => {
        //     // updateCustomerInformation(info);

        //     if (IsLog) console.log(info);

        // });
    }

    // Load all offerings a user can (currently) purchase
    static PurchaseAsync = async (sku: string): Promise<Error | undefined | null> => {
        // init

        this.CheckInit()

        // load products

        const productsOrError = await this.GetProductsAsync(AllIAPProducts);

        // error load products

        if (!Array.isArray(productsOrError))
            return productsOrError

        // find product

        const product = productsOrError.find(i => i.identifier === sku)

        if (!product)
            return new Error("Not found product: " + sku)

        // purchase

        try {
            const success = await Purchases.purchaseStoreProduct(product)

            if (IsLog) console.log('[RevenueCat] purchased success', ToCanPrint(success))

            return undefined // success
        }
        catch (e) {
            // @ts-ignore // user cancel

            if (e && e.userCancelled) {
                if (IsLog) console.log('[RevenueCat] purchased canceled')
                return null
            }

            // other error

            if (IsLog) console.log('[RevenueCat] purchased fail', ToCanPrintError(e))

            return CreateError(e)
        }
    }

    private static GetProductsAsync = async (allIAPProducts: IAPProduct[]): Promise<PurchasesStoreProduct[] | Error> => {
        // get from local

        const localProducts = await GetArrayAsync<PurchasesStoreProduct>(StorageKey_RevenueCatPackages)

        if (localProducts && SafeArrayLength(localProducts) === allIAPProducts.length) {
            if (IsLog) console.log('[RevenueCat] GetProductsAsync success from LOCAL, products count', SafeArrayLength(localProducts), localProducts.map(i => i.identifier).join('|'));
            return localProducts
        }

        // get from store

        const res = await ExecuteWithTimeoutAsync(
            async () => await Purchases.getProducts(allIAPProducts.map(i => i.sku)),
            FirebaseDatabaseTimeOutMs
        )

        // error

        if (res.isTimeOut) {
            if (IsLog) console.log('[RevenueCat] GetProductsAsync error timeout')
            return TimeOutErrorObject
        }

        if (!res.result) {
            if (IsLog) console.log('[RevenueCat] GetProductsAsync error (other)')
            return UnknownErrorObject
        }

        // sucess, save local


        const products = res.result

        await SetArrayAsync(StorageKey_RevenueCatPackages, products)

        if (IsLog) console.log('[RevenueCat] GetProductsAsync success from STORE, products count', products.length, products.map(i => i.identifier).join('|'));

        // return

        return products
    };
}