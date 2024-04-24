import { View, StyleSheet, ColorValue, Animated, LayoutRectangle, DimensionValue, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWindowOrientation from '../Hooks/usePortraitOrLandscape'
import { CommonStyles, DefaultSlideHandle_AspectRatio, DefaultSlideHandle_BorderRadius, DefaultSlideHandle_Size, WindowSize_Max } from '../CommonConstants'
import useSingleMoveGesture from '../Hooks/useSingleMoveGesture'
import { ExtractAllNumbersInText, HexToRgb, SafeGetArrayElement, SafeGetArrayElement_ForceValue } from '../UtilsTS'
import { SwipeResult, useSimpleGesture } from '../Hooks/useSimpleGesture'

const DefaultBorderRadiusPercent = 0.02

const DefaultSlideHandlePaddingPercent = 0.005

/**
 * ## Usage:
```tsx
const [showPopup, set_showPopup] = useState(false)

// const popupCloseCallbackRef = useRef<(onFinished?: () => void) => void>()
// if (popupCloseCallbackRef.current)
//    popupCloseCallbackRef.current(() => console.log('Closed'))

{
    showPopup &&
    <SlidingPopup
      backgroundColor={theme.primary}
      child={renderContent()}
      blurBackgroundColorInHex={theme.background}
      onFinishedHide={set_showPopup}
      childMaxHeight={'60%'}
      setCloseCallbackRef={popupCloseCallbackRef}
    />
}
```
 */
const SlidingPopup = ({
  child,

  childMaxHeight = '100%',

  backgroundColor = 'black',

  handleColor = 'white',

  blurBackgroundColorInHex = '#000000',
  blurBackgroundOpacity = 0.8,

  hideAnimatedDuration = 200,

  onFinishedHide,
  setCloseCallbackRef,
}: {
  child?: React.JSX.Element,

  childMaxHeight?: DimensionValue,

  backgroundColor?: ColorValue,

  handleColor?: ColorValue,

  blurBackgroundColorInHex?: string,
  blurBackgroundOpacity?: number,

  hideAnimatedDuration?: number,

  onFinishedHide?: (active: boolean) => void,
  setCloseCallbackRef?: React.MutableRefObject<undefined | ((onFinished?: () => void) => void)>,
}) => {
  const { windowHeight } = useWindowOrientation()
  const [masterLayout, set_masterLayout] = useState<undefined | LayoutRectangle>(undefined)

  const heightAnimatedRef = useRef(new Animated.Value(0)).current
  const heightCached = useRef(0)

  const startMoveHeightCached = useRef(0)

  const maxHeight = useMemo(() => {
    if (typeof childMaxHeight === 'number') {
      if (masterLayout && masterLayout.height < childMaxHeight)
        return masterLayout.height
      else
        return childMaxHeight
    }
    else if (masterLayout) {
      const numArr = ExtractAllNumbersInText(childMaxHeight)
      const percent = SafeGetArrayElement_ForceValue(numArr, 100) / 100
      return Math.min(masterLayout.height * percent, masterLayout.height)
    }
    else
      return 0
  }, [masterLayout, childMaxHeight])

  const styles = useMemo(() => {
    return StyleSheet.create({
      master: {
        width: '100%', height: '100%',
        position: 'absolute',
        justifyContent: 'flex-end',
      },

      blurView: {
        backgroundColor: HexToRgb(blurBackgroundColorInHex, blurBackgroundOpacity),
        width: '100%', height: '100%',
      },

      animatedHeightView: {
        backgroundColor,
        borderTopRightRadius: windowHeight * DefaultBorderRadiusPercent,
        borderTopLeftRadius: windowHeight * DefaultBorderRadiusPercent,
      },

      slideView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: DefaultSlideHandlePaddingPercent * WindowSize_Max,
      },

      slideHanlde: {
        height: DefaultSlideHandle_Size,
        aspectRatio: DefaultSlideHandle_AspectRatio,
        borderRadius: DefaultSlideHandle_BorderRadius,
        backgroundColor: handleColor,
      },

      contentContainerView: { flex: 1 },
    })
  }, [backgroundColor, blurBackgroundColorInHex, windowHeight])

  /**
   * -1 for set max height
   */
  const setHeight = useCallback((
    to: number,
    isAnimated: boolean,
    onFinished?: () => void) => {
    if (!masterLayout)
      return

    if (to === -1)
      to = maxHeight

    if (heightCached.current === to) {
      if (typeof onFinished === 'function')
        onFinished()

      return
    }

    if (to > maxHeight)
      to = maxHeight

    if (isAnimated) {
      if (to > 0) {
        Animated.spring(heightAnimatedRef, {
          toValue: to,
          useNativeDriver: false,
        }).start(() => {
          if (typeof onFinished === 'function')
            onFinished()
        })
      }
      else {
        Animated.timing(heightAnimatedRef, {
          toValue: to,
          useNativeDriver: false,
          duration: hideAnimatedDuration,
        }).start(() => {
          if (typeof onFinished === 'function')
            onFinished()
        })
      }
    }
    else {
      heightAnimatedRef.setValue(to)

      if (typeof onFinished === 'function')
        onFinished()
    }

    heightCached.current = to
  }, [masterLayout, hideAnimatedDuration, maxHeight])

  const toggleShow = useCallback((
    isShowOrClose: boolean,
    onFinished?: () => void) => {
    setHeight(isShowOrClose ? -1 : 0, true, onFinished)
  }, [setHeight])

  const onPressCloseThis = useCallback((onFinished?: () => void) => {
    toggleShow(false, () => {
      if (typeof onFinishedHide === 'function')
        onFinishedHide(false)

      if (typeof onFinished === 'function')
        onFinished()
    })
  }, [toggleShow, onFinishedHide])

  if (setCloseCallbackRef)
    setCloseCallbackRef.current = onPressCloseThis

  // move gesture

  const onStartMove = useCallback(() => {
    startMoveHeightCached.current = heightCached.current
  }, [])

  const onMovingHandle = useCallback((_: number, offsetY: number) => {
    const to = startMoveHeightCached.current - offsetY

    setHeight(to, true)
  }, [setHeight])

  const { viewResponsers: handleViewResponsers } = useSingleMoveGesture(onStartMove, onMovingHandle, undefined)

  // swipe

  const onSwiped = useCallback((result: SwipeResult) => {
    if (result.primaryDirectionIsHorizontalOrVertical)
      return

    // swiped down

    if (result.primaryDirectionIsPositive) {
      onPressCloseThis()
    }

    // swipe up

    else {
      toggleShow(true)
    }
  }, [onPressCloseThis, toggleShow])

  const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(undefined, undefined, onSwiped)

  // use effect

  useEffect(() => {
    if (!masterLayout)
      return

    toggleShow(true)
  }, [masterLayout])

  return (
    <View onLayout={(e) => set_masterLayout(e.nativeEvent.layout)} style={styles.master}>
      {/* blur bg */}
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPressCloseThis()} style={styles.blurView} />

      {/* popup */}
      <Animated.View style={[styles.animatedHeightView, { height: heightAnimatedRef }]}>
        {/* handle */}
        <View
          {...handleViewResponsers}
          onTouchStart={onBigViewStartTouch}
          onTouchEnd={onBigViewEndTouch}
          style={styles.slideView}
        >
          <View style={styles.slideHanlde} />
        </View>

        {/* content */}
        <View style={styles.contentContainerView}>
          {
            child
          }
        </View>
      </Animated.View>
    </View>
  )
}

export default SlidingPopup