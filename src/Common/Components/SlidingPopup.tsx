import { View, StyleSheet, ColorValue, Animated, LayoutRectangle } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWindowOrientation from '../Hooks/usePortraitOrLandscape'
import { DefaultSlideHandle_AspectRatio, DefaultSlideHandle_BorderRadius, DefaultSlideHandle_Size, WindowSize_Max } from '../CommonConstants'
import useSingleMoveGesture from '../Hooks/useSingleMoveGesture'

const DefaultBorderRadiusPercent = 0.02

const DefaultSlideHandlePaddingPercent = 0.005

const SlidingPopup = ({
  child,
  backgroundColor = 'black',
  handleColor = 'white',
}: {
  child: React.JSX.Element,
  backgroundColor?: ColorValue,
  handleColor?: ColorValue,
}) => {
  const { windowHeight } = useWindowOrientation()
  const [masterLayout, set_masterLayout] = useState<undefined | LayoutRectangle>(undefined)

  const heightAnimatedRef = useRef(new Animated.Value(0)).current
  const heightCached = useRef(0)
  const startMoveHeightCached = useRef(0)

  const styles = useMemo(() => {
    return StyleSheet.create({
      master: {
        // backgroundColor: 'gray',
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
  }, [backgroundColor, windowHeight])

  /**
   * -1 for set max height
   */
  const setHeight = useCallback((to: number, isAnimated: boolean) => {
    if (!masterLayout)
      return

    if (to === -1)
      to = masterLayout.height

    if (heightCached.current === to) {
      return
    }

    if (to > masterLayout.height)
      to = masterLayout.height

    if (isAnimated) {
      Animated.spring(heightAnimatedRef, {
        toValue: to,
        useNativeDriver: false,
      }).start()
    }
    else {
      heightAnimatedRef.setValue(to)
    }

    heightCached.current = to
  }, [masterLayout])

  const toggleShow = useCallback((isShowOrClose: boolean) => {
    setHeight(-1, true)
  }, [setHeight])

  const onPressClose = useCallback(() => {
    // runShowEffect(RandomInt(1, 10) > 5)
  }, [toggleShow])

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
    <View pointerEvents='box-none' onLayout={(e) => set_masterLayout(e.nativeEvent.layout)} style={styles.master}>
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