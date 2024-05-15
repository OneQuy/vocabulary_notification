// MUST FirebaseInit() first

import { getDatabase, ref, onValue, set, get, remove } from 'firebase/database';
import { ExecuteWithTimeoutAsync, TimeOutError } from '../handle/UtilsTS';

var db = null;

function CheckAndInit() {
    if (!db)
        db = getDatabase();
}

// Usage: FirebaseDatabase_SetValue('hichic/hoho', valueObject, () => { console.log('done!'); });
export function FirebaseDatabase_SetValue(relativePath, valueObject, callback) {
    CheckAndInit();
    const reference = ref(db, relativePath);

    set(reference, valueObject).then(function () {
        if (callback)
            callback();
    });
}

/**
 * @returns null if SUCCESS, error if error.
 */
export async function FirebaseDatabase_SetValueAsync(relativePath, valueObject) {
    CheckAndInit();

    try {
        const reference = ref(db, relativePath);
        await set(reference, valueObject);
        return null;
    }
    catch (err) {
        return err;
    }
}

/**
 * @returns Unsubribe method. (Usage: Unsubribe())
 */
export function FirebaseDatabase_OnValue(relativePath, callback) {
    CheckAndInit();
    const reference = ref(db, relativePath);

    return onValue(reference, (snapshot) => {
        if (callback)
            callback(snapshot.val());
    });
}


/**
 * @returns Object {
 *      value: value. Or null if has no data,
 *      error: error. Or null if success }
 */
export async function FirebaseDatabase_GetValueAsyncWithTimeOut(relativePath, timeout) { // sub 
    const res = await ExecuteWithTimeoutAsync(
        async () => await FirebaseDatabase_GetValueAsync(relativePath),
        timeout)

    if (res.isTimeOut || res.result === undefined) {
        // handle time out or other error here
        return {
            value: null,
            error: new Error(TimeOutError)
        }
    }
    else {
        // handle susccess here
        return res.result
    }
}

/**
 * @returns Object {
 *      value: value. Or null if has no data,
 *      error: error. Or null if success }
 */
export async function FirebaseDatabase_GetValueAsync(relativePath) { // main 
    CheckAndInit();

    try {
        const reference = ref(db, relativePath);
        var snapshot = await get(reference);
        return {
            value: snapshot.val(),
            error: null
        }
    }
    catch (err) {
        return {
            value: null,
            error: err
        }
    }
}

/**
 * @returns Object {
 *      value: value. or null if has no data,
 *      error: error. nor null if success }
 */
export async function FirebaseDatabase_IncreaseNumberAsync( // main 
    relativePath,
    startValue = -1,
    incNum = 1,
    callback = undefined,
    minValue = Number.NEGATIVE_INFINITY) {
    CheckAndInit();

    try {
        // get

        const reference = ref(db, relativePath);
        var snapshot = await get(reference);
        let value = snapshot.val();

        if (value == null) {
            value = startValue
        }

        // set

        value += incNum;
        value = Math.max(minValue, value)

        let error = await FirebaseDatabase_SetValueAsync(relativePath, value);

        if (error) {
            const res = {
                value: null,
                error: error
            }

            if (typeof callback === 'function')
                callback(res)

            return res
        }

        // return

        const res = {
            value: value,
            error: null
        }

        if (typeof callback === 'function')
            callback(res)

        return res
    }
    catch (err) {
        const res = {
            value: null,
            error: err
        }

        if (typeof callback === 'function')
            callback(res)

        return res
    }
}

/**
 * @returns null if SUCCESS, otherwise error.
 */
export async function FirebaseDatabase_RemoveAsync(relativePath) {
    CheckAndInit();

    try {
        const reference = ref(db, relativePath);
        await remove(reference);
        return null;
    }
    catch (err) {
        return err;
    }
}