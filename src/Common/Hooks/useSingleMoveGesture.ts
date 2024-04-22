// useSingleMoveGesture - 26 Mar 2024 (Creating StyleShot)

import { useMemo, useRef } from "react"
import { GestureResponderEvent, NativeTouchEvent, ViewProps } from "react-native"

/**
 ## Usage:
 ```tsx
    // step 1
    const onMovingHandle = useCallback((offsetX: number, offsetY: number) => {
        console.log(offsetX, offsetY);
    }, [])

    // step 2
    const { viewResponsers } = useSingleMoveGesture(undefined, onMovingHandle, undefined)

    // step 3
    <View {...viewResponsers} style={...}>

    // done!
 ```
 * @returns 
 */
const useSingleMoveGesture = (
    onStartMove?: () => void,
    onMoving?: (offsetX: number, offsetY: number) => void,
    onEndMove?: () => void,
) => {
    const initialTouch = useRef<NativeTouchEvent | undefined>(undefined)

    const viewResponsers = useMemo<ViewProps>(() => {
        return {
            onMoveShouldSetResponder: (event: GestureResponderEvent) => { // start move
                const touches = event.nativeEvent.touches

                if (touches.length !== 1)
                    return false

                initialTouch.current = touches[0]

                if (onStartMove)
                    onStartMove()

                return true
            },

            onResponderMove: (event: GestureResponderEvent) => { // moving
                if (!initialTouch.current) {
                    return
                }

                const touches = event.nativeEvent.touches

                if (touches.length !== 1)
                    return

                const touch = touches[0]

                const offsetX = touch.pageX - initialTouch.current.pageX
                const offsetY = touch.pageY - initialTouch.current.pageY

                if (onMoving)
                    onMoving(offsetX, offsetY)
            },

            onResponderEnd: (_: GestureResponderEvent) => { // end move
                initialTouch.current = undefined // reset

                if (onEndMove)
                    onEndMove()
            },
        }
    }, [onStartMove, onMoving, onEndMove])

    return { viewResponsers }
}

export default useSingleMoveGesture