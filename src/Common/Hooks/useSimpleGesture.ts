import { useCallback, useRef } from "react";
import { GestureResponderEvent } from "react-native";

const maxLimitMsForOneTap = 300
const maxLimitMsForSwipe = 500
const touchDistanceThreshold = 5;

export type SwipeResult = {
    isLeftToRight: boolean,
    isTopToBottom: boolean

    distanceX: number,
    distanceY: number

    primaryDirectionIsHorizontalOrVertical: boolean,
    primaryDirectionIsPositive: boolean,

    duration: number
}

/**
    * USAGE:
    * ```js
    * const onTapCounted = useCallback((count: number, lastTapEvent: GestureResponderEvent['nativeEvent']) => {}, [])
    *
    * const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(onTapCounted, onLongPressed)
    * 
    * <View onTouchStart={onBigViewStartTouch} onTouchEnd={onBigViewEndTouch} />
    * 
    * Or
    * 
    * onPressIn={onBigViewStartTouch} onPressOut={onBigViewEndTouch}
    * ```
 */
export const useSimpleGesture = (
    onTapCounted?: (count: number, lastTapNativeEvent: GestureResponderEvent['nativeEvent']) => void,
    onLongPressed?: () => void,
    onSwiped?: (result: SwipeResult) => void,
): [
        (e: GestureResponderEvent) => void,
        (e: GestureResponderEvent) => void,
    ] => {
    const startTouchNativeEventRef = useRef<GestureResponderEvent['nativeEvent'] | null>(null);
    const tapTimeOutCallbackRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const tapCountRef = useRef(0)
    const lastTapTickRef = useRef(0)

    const onTouchStart = useCallback((e: GestureResponderEvent) => {
        startTouchNativeEventRef.current = e.nativeEvent;
    }, []);

    const triggerTapCounted = useCallback((e: GestureResponderEvent['nativeEvent']) => {
        if (typeof onTapCounted !== 'function')
            return

        onTapCounted(tapCountRef.current, e)
    }, [onTapCounted])

    const handleCountTap = useCallback((e: GestureResponderEvent['nativeEvent']) => {
        const now = Date.now()
        const howLongFromLastTap = now - lastTapTickRef.current
        lastTapTickRef.current = now

        if (howLongFromLastTap > maxLimitMsForOneTap) { // count as a new tap
            tapCountRef.current = 1
        }
        else { // count as a continous tap
            tapCountRef.current++
        }

        if (tapTimeOutCallbackRef.current)
            clearTimeout(tapTimeOutCallbackRef.current)

        tapTimeOutCallbackRef.current = setTimeout(() => triggerTapCounted(e), maxLimitMsForOneTap);
    }, [triggerTapCounted])

    const onTouchEnd = useCallback((e: GestureResponderEvent) => {
        if (!startTouchNativeEventRef.current) {
            console.error('startTouchNativeEventRef.current is null')
            return
        }

        const distanceX = e.nativeEvent.locationX - startTouchNativeEventRef.current.locationX
        const distanceY = e.nativeEvent.locationY - startTouchNativeEventRef.current.locationY

        const distanceFromStart = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))

        const isTouchOrMove = distanceFromStart < touchDistanceThreshold // is touch or move
        const howLongFromStartTouch = e.nativeEvent.timestamp - startTouchNativeEventRef.current.timestamp;

        // is move

        if (!isTouchOrMove) {
            if (typeof onSwiped === 'function' && howLongFromStartTouch < maxLimitMsForSwipe) {
                const isLeftToRight = distanceX > 0
                const isTopToBottom = distanceY > 0
                const primaryDirectionIsHorizontalOrVertical = Math.abs(distanceX) > Math.abs(distanceY)
                const primaryDirectionIsPositive = primaryDirectionIsHorizontalOrVertical ? isLeftToRight : isTopToBottom

                onSwiped({
                    isLeftToRight,
                    isTopToBottom,
                    distanceX,
                    distanceY,
                    primaryDirectionIsHorizontalOrVertical,
                    primaryDirectionIsPositive,
                    duration: howLongFromStartTouch,
                } as SwipeResult)
            }

            return
        }

        // is not move

        const isLongPressed = howLongFromStartTouch > maxLimitMsForOneTap && isTouchOrMove;
        const isTap = !isLongPressed && isTouchOrMove; // tap = quick touch

        if (isTap)
            handleCountTap({ ...e.nativeEvent })
        else if (isLongPressed && typeof onLongPressed === 'function')
            onLongPressed()
    }, [handleCountTap, onLongPressed, onSwiped])

    return [onTouchStart, onTouchEnd] as const
}