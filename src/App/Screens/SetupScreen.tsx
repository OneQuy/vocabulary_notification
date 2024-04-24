import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { AddS, GetDayHourMinSecFromMs, GetDayHourMinSecFromMs_ToString, PrependZero } from '../../Common/UtilsTS'
import HairLine from '../../Common/Components/HairLine'
import { WindowSize_Max } from '../../Common/CommonConstants'
import SlidingPopup from '../../Common/Components/SlidingPopup'
import { PopuplarityLevelNumber } from '../Constants/AppConstants'
import TimePicker, { TimePickerResult } from '../Components/TimePicker'

const IntervalInMinPresets: (undefined | number)[] = [
  30,
  60,
  120,
  180,
  240,
  300,
  360,
  420,
  480,
  60 * 24,
  undefined // custom
]

const LimitWordPresets: (number)[] = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
]

type PairTime = TimePickerResult[]

type PopupType = 'popularity' | 'interval' | 'limit-word' | undefined

const SetupScreen = () => {
  const theme = useTheme()
  const texts = useLocalText()

  const [showPopup, set_showPopup] = useState<PopupType>(undefined)
  const popupCloseCallbackRef = useRef<(onFinished?: () => void) => void>()

  const [displayPopularityLevelIdx, set_displayPopularityLevelIdx] = useState(0)

  const [displayIntervalInMin, set_displayIntervalInMin] = useState<number>(60)

  const [displayWordLimitNumber, set_displayWordLimitNumber] = useState<number>(5)

  const [displayExcludeTimePairs, set_displayExcludeTimePairs] = useState<PairTime[]>([
    [
      {
        hours: 22,
        minutes: 0,
        seconds: 0,
      },
      {
        hours: 7,
        minutes: 0,
        seconds: 0,
      }
    ]
  ])

  const [showTimePicker, set_showTimePicker] = useState(false)

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, },
      scrollView: { gap: Gap.Small, padding: Outline.Normal, },

      scrollViewSlidingPopup: { gap: Gap.Small, padding: Outline.Normal, },

      workTimeView: { flexDirection: 'row', gap: Gap.Normal, },
      workTimeChildView: { gap: Gap.Small, flex: 1, },

      header: { fontWeight: FontBold.Bold, fontSize: FontSize.Normal, color: theme.primary },

      normalBtnTxt: { fontSize: FontSize.Normal, },

      normalBtn: {
        borderWidth: WindowSize_Max * 0.0015,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
      },

      normalBtn_NoBorder: {
        padding: Outline.Normal,
      }
    })
  }, [theme])

  // popularity

  const onPressPopularityLevel = useCallback((index: number) => {
    set_displayPopularityLevelIdx(index)

    if (popupCloseCallbackRef.current)
      popupCloseCallbackRef.current()
  }, [])

  const onPressShowPopup = useCallback((type: PopupType) => {
    set_showPopup(type)
  }, [])

  const renderPopularityLevels = useCallback(() => {
    const arr = Array(PopuplarityLevelNumber).fill(undefined)

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollViewSlidingPopup}
      >
        {
          arr.map((i: any, index: number) => {
            const isSelected = displayPopularityLevelIdx === index

            return (
              <LucideIconTextEffectButton
                key={index}

                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                onPress={() => onPressPopularityLevel(index)}

                manuallySelected={isSelected}
                notChangeToSelected
                canHandlePressWhenSelected

                style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                title={
                  texts.level +
                  ' ' +
                  (index + 1) +
                  (index === 0 ?
                    ` (${texts.most_popular})` :
                    (index === PopuplarityLevelNumber - 1 ? ` (${texts.rarest})` : '')
                  )
                }

                titleProps={{ style: style.normalBtnTxt }}
              />
            )
          })
        }
      </ScrollView>
    )
  }, [displayPopularityLevelIdx, theme, style])

  // interval

  const onPressInterval = useCallback((minutesOrCustom: number | undefined) => {
    if (minutesOrCustom !== undefined)
      set_displayIntervalInMin(minutesOrCustom)

    if (popupCloseCallbackRef.current)
      popupCloseCallbackRef.current(() => {
        if (minutesOrCustom === undefined) // custom
          set_showTimePicker(true)
      })
  }, [])

  const renderIntervals = useCallback(() => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollViewSlidingPopup}
      >
        {
          IntervalInMinPresets.map((min: number | undefined) => {
            const isSelected = min === undefined ?
              (!IntervalInMinPresets.includes(displayIntervalInMin)) : // custom
              (min === displayIntervalInMin) // minutes

            return (
              <LucideIconTextEffectButton
                key={min ?? 'custom'}

                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                onPress={() => onPressInterval(min)}

                manuallySelected={isSelected}
                notChangeToSelected
                canHandlePressWhenSelected

                style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                title={min === undefined ?
                  texts.custom :
                  GetDayHourMinSecFromMs_ToString(min * 60 * 1000, ' ', true, false, '-')
                }

                titleProps={{ style: style.normalBtnTxt }}
              />
            )
          })
        }
      </ScrollView>
    )
  }, [displayIntervalInMin, theme, style])

  // limit words

  const onPressLimitWord = useCallback((wordNum: number) => {
    if (wordNum !== undefined)
      set_displayWordLimitNumber(wordNum)

    if (popupCloseCallbackRef.current)
      popupCloseCallbackRef.current()
  }, [])

  const renderWordLimits = useCallback(() => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollViewSlidingPopup}
      >
        {
          LimitWordPresets.map((wordNum: number) => {
            const isSelected = wordNum === displayWordLimitNumber

            return (
              <LucideIconTextEffectButton
                key={wordNum}

                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                onPress={() => onPressLimitWord(wordNum)}

                manuallySelected={isSelected}
                notChangeToSelected
                canHandlePressWhenSelected

                style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                title={wordNum === 0 ? texts.no_limit : (wordNum + ' ' + AddS(texts.word, wordNum))}

                titleProps={{ style: style.normalBtnTxt }}
              />
            )
          })
        }
      </ScrollView>
    )
  }, [displayWordLimitNumber, theme, style])

  // exclude time

  const renderExcludeTimes = useCallback(() => {
    return (
      displayExcludeTimePairs.map((pair: PairTime) => {
        return (
          <View style={style.workTimeView}>
            {/* from */}
            <View style={style.workTimeChildView}>
              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={theme.counterBackground}
                notChangeToSelected
                style={style.normalBtn}

                title={`${PrependZero(pair[0].hours)}:${PrependZero(pair[0].minutes)}`}
                titleProps={{ style: style.normalBtnTxt }}
              />
            </View>

            {/* to */}
            <View style={style.workTimeChildView}>
              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={theme.counterBackground}
                notChangeToSelected
                style={style.normalBtn}

                title={`${PrependZero(pair[1].hours)}:${PrependZero(pair[1].minutes)}`}
                titleProps={{ style: style.normalBtnTxt }}
              />
            </View>
          </View>
        )
      })
    )
  }, [displayExcludeTimePairs, theme, style])

  // common

  let contentToRenderInPopup = undefined

  if (showPopup === 'popularity')
    contentToRenderInPopup = renderPopularityLevels
  else if (showPopup === 'interval')
    contentToRenderInPopup = renderIntervals
  else if (showPopup === 'limit-word')
    contentToRenderInPopup = renderWordLimits

  const curIntervalArr = GetDayHourMinSecFromMs(displayIntervalInMin * 60 * 1000)

  // render

  return (
    <View style={style.master}>
      <ScrollView contentContainerStyle={style.scrollView} showsVerticalScrollIndicator={false}>
        {/* popularity_level */}

        <Text style={style.header}>{texts.popularity_level}</Text>

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={texts.level + ' ' + (displayPopularityLevelIdx + 1)}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'BookAIcon', size: FontSize.Normal, }}

          onPress={() => onPressShowPopup('popularity')}
        />

        {/* interval */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <Text style={style.header}>{texts.show_every}</Text>

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={GetDayHourMinSecFromMs_ToString(displayIntervalInMin * 60 * 1000, ' ', true, false, '-')}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Clock', size: FontSize.Normal, }}

          onPress={() => onPressShowPopup('interval')}
        />

        {/* limit words */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <Text style={style.header}>{texts.limit_words_per_day}</Text>

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={displayWordLimitNumber === 0 ? texts.no_limit : (displayWordLimitNumber + ' ' + AddS(texts.word, displayWordLimitNumber))}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Repeat', size: FontSize.Normal, }}

          onPress={() => onPressShowPopup('limit-word')}
        />

        {/* exclude time */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <Text style={style.header}>{texts.not_show}</Text>

        {
          renderExcludeTimes()
        }

        {/* test noti */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={texts.test_notification}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Bell', size: FontSize.Normal, }}
        />

        {/* set notification */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <LucideIconTextEffectButton
          selectedBackgroundColor={theme.primary}

          selectedColorOfTextAndIcon={theme.counterPrimary}
          unselectedColorOfTextAndIcon={theme.counterBackground}

          notChangeToSelected
          manuallySelected={true}

          style={style.normalBtn}

          title={texts.set_notification}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Rocket', size: FontSize.Normal, }}
        />
      </ScrollView>

      {/* popup */}
      {
        contentToRenderInPopup &&
        <SlidingPopup
          backgroundColor={theme.primary}
          blurBackgroundColorInHex={theme.background}
          handleColor={theme.counterPrimary}
          child={contentToRenderInPopup()}
          onFinishedHide={() => set_showPopup(undefined)}
          childMaxHeight={'80%'}
          setCloseCallbackRef={popupCloseCallbackRef}
        />
      }

      {/* time picker */}
      {
        showTimePicker &&
        <TimePicker
          setIsVisible={set_showTimePicker}
          onConfirm={(time) => set_displayIntervalInMin(time.hours * 60 + time.minutes)}
          initialHour={curIntervalArr[1]}
          initialMinute={curIntervalArr[2]}
        />
      }
    </View>
  )
}

export default SetupScreen