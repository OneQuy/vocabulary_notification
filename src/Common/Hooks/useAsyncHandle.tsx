import { useEffect, useState } from 'react';

export type UseAsyncHandleResult<T> = {
    handled: boolean,
    result: T | undefined
}

/**
 * usage: const {handled, result} = useAsyncHandle(LoadAppData);
 */
export default function useAsyncHandle<T>(asyncFunc: () => Promise<T>) {    
    const [result, setResult] = useState<UseAsyncHandleResult<T>>({ handled: false, result: undefined });

    useEffect(() =>
    {
       const Load = async () =>
       {
            const res: T = await asyncFunc();
            setResult({handled: true, result: res});
       }

       Load();
    }, [])

    return result;
}