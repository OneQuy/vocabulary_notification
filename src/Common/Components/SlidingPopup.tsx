import { View, StyleSheet, ColorValue, Animated, LayoutRectangle, DimensionValue } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWindowOrientation from '../Hooks/usePortraitOrLandscape'
import { DefaultSlideHandle_AspectRatio, DefaultSlideHandle_BorderRadius, DefaultSlideHandle_Size, WindowSize_Max } from '../CommonConstants'
import useSingleMoveGesture from '../Hooks/useSingleMoveGesture'
import { ExtractAllNumbersInText, HexToRgb, SafeGetArrayElement, SafeGetArrayElement_ForceValue } from '../UtilsTS'

const DefaultBorderRadiusPercent = 0.02

const DefaultSlideHandlePaddingPercent = 0.005

const SlidingPopup = ({
  child,

  childMaxHeight = '100%',

  backgroundColor = 'black',

  handleColor = 'white',

  blurBackgroundColorInHex = '#000000',
  blurBackgroundOpacity = 0.8,

  onPressClose,
}: {
  child?: React.JSX.Element,

  childMaxHeight?: DimensionValue,

  backgroundColor?: ColorValue,

  handleColor?: ColorValue,

  blurBackgroundColorInHex?: string,
  blurBackgroundOpacity?: number,

  onPressClose?: (active: boolean) => void,
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
        backgroundColor: HexToRgb(blurBackgroundColorInHex, blurBackgroundOpacity),
        width: '100%', height: '100%',
        position: 'absolute',
        justifyContent: 'flex-end',
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
          duration: 200,
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
  }, [masterLayout, maxHeight])

  const toggleShow = useCallback((
    isShowOrClose: boolean,
    onFinished?: () => void) => {
    setHeight(isShowOrClose ? -1 : 0, true, onFinished)
  }, [setHeight])

  const onPressCloseThis = useCallback(() => {
    toggleShow(false, () => {
      if (typeof onPressClose === 'function')
        onPressClose(false)
    })
  }, [toggleShow, onPressClose])

  // move gesture

  const onStartMove = useCallback(() => {
    startMoveHeightCached.current = heightCached.current
  }, [])

  const onMovingHandle = useCallback((_: number, offsetY: number) => {
    const to = startMoveHeightCached.current - offsetY

    setHeight(to, true)
  }, [setHeight])

  const { viewResponsers: handleViewResponsers } = useSingleMoveGesture(onStartMove, onMovingHandle, undefined)

  useEffect(() => {
    if (!masterLayout)
      return

    toggleShow(true)
  }, [masterLayout])

  return (
    <View onTouchEnd={onPressCloseThis} onLayout={(e) => set_masterLayout(e.nativeEvent.layout)} style={styles.master}>
      <Animated.View style={[styles.animatedHeightView, { height: heightAnimatedRef }]}>
        {/* handle */}
        <View {...handleViewResponsers} style={styles.slideView}>
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