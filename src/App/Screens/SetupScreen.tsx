import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { AddS, ArrayRemove, CloneObject, GetDayHourMinSecFromMs, GetDayHourMinSecFromMs_ToString, LogStringify, PrependZero, RandomInt } from '../../Common/UtilsTS'
import HairLine from '../../Common/Components/HairLine'
import { CommonStyles, WindowSize_Max } from '../../Common/CommonConstants'
import SlidingPopup from '../../Common/Components/SlidingPopup'
import { DefaultExcludedTimePairs, DefaultIntervalInMin, IntervalInMinPresets, LimitWordsPerDayPresets, PopuplarityLevelNumber } from '../Constants/AppConstants'
import TimePicker, { TimePickerResult } from '../Components/TimePicker'
import { LucideIcon } from '../../Common/Components/LucideIcon'
import { cancelAllLocalNotificationsAsync, requestPermissionNotificationAsync } from '../../Common/Nofitication'
import { AuthorizationStatus } from '@notifee/react-native'
import { Language, Languages } from '../../Common/DeepTranslateApi'
import { PairTime } from '../Types'
import { AddOrUpdateLocalizedWordsToDbAsync, CheckInitDBAsync, GetLocalizedWordFromDbAsync } from '../Handles/LocalizedWordsTable'
import { SetNotificationAsync, TotalMin } from '../Handles/AppUtils'
import { SqlGetAllRowsAsync, SqlGetAllRowsWithColumnIncludedInArrayAsync, SqlInsertOrUpdateAsync, SqlInsertOrUpdateAsync_Object, SqlIsExistedAsync, SqlLogAllRowsAsync } from '../../Common/SQLite'

type PopupType = 'popularity' | 'interval' | 'limit-word' | 'target-lang' | undefined

const SetupScreen = () => {
  const theme = useTheme()
  const texts = useLocalText()

  const [showPopup, set_showPopup] = useState<PopupType>(undefined)
  const popupCloseCallbackRef = useRef<(onFinished?: () => void) => void>()

  const [displayPopularityLevelIdx, set_displayPopularityLevelIdx] = useState(0)

  const [displayIntervalInMin, set_displayIntervalInMin] = useState<number>(DefaultIntervalInMin)

  const [displayWordLimitNumber, set_displayWordLimitNumber] = useState<number>(5)

  const [displayTargetLang, set_displayTargetLang] = useState<Language | undefined>()
  const [searchLangInputTxt, set_searchLangInputTxt] = useState('')

  const [displayExcludeTimePairs, set_displayExcludeTimePairs] = useState<PairTime[]>(DefaultExcludedTimePairs)
  const editingExcludeTimePairAndElementIndex = useRef<[PairTime | undefined, number]>([undefined, -1])

  const [showTimePicker, set_showTimePicker] = useState(false)

  const [handling, set_handling] = useState(false)

  // common

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, },
      scrollView: { gap: Gap.Small, padding: Outline.Normal, },

      scrollViewSlidingPopup: { gap: Gap.Small, padding: Outline.Normal, },

      excludeTimeView: { flexDirection: 'row', gap: Gap.Normal, alignItems: 'center' },
      excludeTimeChildView: { flex: 1, },
      excludeTimeTitleView: { flexDirection: 'row', justifyContent: 'space-between' },

      header: { fontWeight: FontBold.Bold, fontSize: FontSize.Normal, color: theme.primary },

      normalBtnTxt: { fontSize: FontSize.Normal, },

      searchCountryView: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: BorderRadius.Medium,
        borderColor: theme.counterPrimary,
        padding: Outline.Normal,
        justifyContent: 'center',
        alignItems: 'center',
        margin: Outline.Normal,
      },

      searchTxt: { fontSize: FontSize.Normal, color: theme.counterPrimary },

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

  const onPressTestNotification = useCallback(async () => {
    // const res = await systra(
    //   SystranTranslateApiKey,
    // const res = await DeepTranslateAsync(
    //   DeepTranslateApiKey,
    //   [
    //     'the',
    //     'love', 
    //     'rope',
    //     'ring',
    //     'roooaa',
    //     'this'
    //   ],
    //   'vi'
    // )

    // // console.log(res);
    // console.log(JSON.stringify(res, null, 1));

    await CheckInitDBAsync()

    // const res = await SqlIsExistedAsync('LocalizedWordsTable', { column: 'lastNotiTick', value: '2' })
    // console.log(res);

    // let res = await SqlInsertOrUpdateAsync_Object('LocalizedWordsTable',
    //   {
    //     wordAndLang: 'hello_en',
    //     lastNotiTick: Date.now() + 5000000,
    //     localizedData: 'hellooooo'
    //   }
    // )

    // res = await SqlInsertOrUpdateAsync_Object('LocalizedWordsTable',
    //   {
    //     wordAndLang: 'hello_vi',
    //     lastNotiTick: -1,
    //     localizedData: 'viiiiii'
    //   }
    // )
    
    // res = await SqlInsertOrUpdateAsync_Object('LocalizedWordsTable',
    //   {
    //     wordAndLang: 'good_vi',
    //     lastNotiTick: Date.now(),
    //     localizedData: 'gooddddddd'
    //   }
    // )

    // const a = await GetLocalizedWordFromDbAsyncWordsAsync(undefined, false)

    // console.log(LogStringify(a));

    const rows = await SqlGetAllRowsWithColumnIncludedInArrayAsync('LocalizedWordsTable', 'lastNotiTick', [-1, 'uu'])

    // if (rows instanceof Error)
    //   return

    console.log(rows)

    // SqlLogAllRowsAsync('LocalizedWordsTable')

    // if (res instanceof Error)
    // console.log(res);
    // else
    //   console.log(res.rows);

    // const res = await AddSeenWordsAsync([
    // {
    //   word: 'uu',

    //   localized: {
    //     lang: 'vi',
    //     translated: 'huleii'
    //   },

    //   notiTick: 1
    // },
    // {
    //   word: 'hehe',

    //   localized: {
    //     lang: 'en',
    //     translated: 'heheeen'
    //   },

    //   notiTick: 3
    // },
    // {
    //   word: 'hehe',

    //   localized: {
    //     lang: 'vi',
    //     translated: 'vi222'
    //   },

    //   notiTick: 4
    // }
    // ])

    // console.log(res);

    // await LoadAllSeenWordsAsync()
  }, [])

  const onPressSetNotification = useCallback(async () => {
    set_handling(true)

    const resPermission = await requestPermissionNotificationAsync()

    if (resPermission.authorizationStatus === AuthorizationStatus.DENIED) {
      set_handling(false)
      Alert.alert(texts.popup_error, texts.no_permission)

      return
    }

    await SetNotificationAsync()

    set_handling(false)
  }, [displayIntervalInMin, displayExcludeTimePairs, texts])

  const onConfirmTimePicker = useCallback((time: TimePickerResult) => {
    if (editingExcludeTimePairAndElementIndex.current[0] === undefined ||
      editingExcludeTimePairAndElementIndex.current[1] === -1
    ) { // set for interval
      set_displayIntervalInMin(time.hours * 60 + time.minutes)
    }
    else { // for exclude time
      const totalMin = TotalMin(time)

      if (editingExcludeTimePairAndElementIndex.current[1] == 1) { // set end time
        const totalMin_StartTime = TotalMin(editingExcludeTimePairAndElementIndex.current[0][0])

        if (totalMin <= totalMin_StartTime) {
          Alert.alert(texts.invalid_input, texts.invalid_end_time)
          return
        }
      }
      else { // set start time
        const totalMin_EndTime = TotalMin(editingExcludeTimePairAndElementIndex.current[0][1])

        if (totalMin >= totalMin_EndTime) {
          Alert.alert(texts.invalid_input, texts.invalid_start_time)
          return
        }
      }

      editingExcludeTimePairAndElementIndex.current[0][editingExcludeTimePairAndElementIndex.current[1]] = time
      editingExcludeTimePairAndElementIndex.current = [undefined, -1]
      set_displayExcludeTimePairs(CloneObject(displayExcludeTimePairs))
    }
  }, [displayExcludeTimePairs, texts])

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
          LimitWordsPerDayPresets.map((wordNum: number) => {
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

  // limit words

  const onPressTargetLang = useCallback((lang: Language) => {
    set_displayTargetLang(lang)

    if (popupCloseCallbackRef.current)
      popupCloseCallbackRef.current()
  }, [])

  const renderPickTargetLang = useCallback(() => {
    const langs = Languages.filter(lang => searchLangInputTxt.length === 0 || lang.name.toLowerCase().includes(searchLangInputTxt.toLowerCase()))

    return (
      <View style={CommonStyles.flex_1}>
        {/* input search */}
        <View style={style.searchCountryView}>
          <TextInput
            style={style.searchTxt}
            placeholder={texts.search_language}
            maxLength={20}
            textContentType='countryName'
            keyboardType='default'
            value={searchLangInputTxt}
            onChangeText={set_searchLangInputTxt}
            autoCapitalize='none'
          />
        </View>

        {/* country */}
        <View style={CommonStyles.flex_1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={style.scrollViewSlidingPopup}
          >
            {
              langs.map((lang: Language) => {
                const isSelected = lang === displayTargetLang

                return (
                  <LucideIconTextEffectButton
                    key={lang.language}

                    selectedColorOfTextAndIcon={theme.primary}
                    unselectedColorOfTextAndIcon={theme.counterPrimary}

                    onPress={() => onPressTargetLang(lang)}

                    manuallySelected={isSelected}
                    notChangeToSelected
                    canHandlePressWhenSelected

                    style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                    title={lang.name}

                    titleProps={{ style: style.normalBtnTxt }}
                  />
                )
              })
            }
          </ScrollView>
        </View>
      </View>
    )
  }, [displayTargetLang, searchLangInputTxt, texts, theme, style])

  // exclude time

  const onPressAddExcludeTime = useCallback(() => {
    displayExcludeTimePairs.push(DefaultExcludedTimePairs[0])
    set_displayExcludeTimePairs(CloneObject(displayExcludeTimePairs))
  }, [displayExcludeTimePairs])

  const onPressRemoveExcludeTime = useCallback((pair: PairTime) => {
    ArrayRemove(displayExcludeTimePairs, pair)
    set_displayExcludeTimePairs(CloneObject(displayExcludeTimePairs))
  }, [displayExcludeTimePairs])

  const renderExcludeTimes = useCallback(() => {
    return (
      displayExcludeTimePairs.map((pair: PairTime, index: number) => {
        return (
          <View key={index} style={style.excludeTimeView}>
            {/* from */}
            <View style={style.excludeTimeChildView}>
              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={theme.counterBackground}
                notChangeToSelected
                style={style.normalBtn}

                title={`${PrependZero(pair[0].hours)}:${PrependZero(pair[0].minutes)}`}
                titleProps={{ style: style.normalBtnTxt }}

                onPress={() => {
                  editingExcludeTimePairAndElementIndex.current = [pair, 0]
                  set_showTimePicker(true)
                }}
              />
            </View>

            <LucideIcon name='MoveRight' color={theme.counterBackground} />

            {/* to */}
            <View style={style.excludeTimeChildView}>
              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={theme.counterBackground}
                notChangeToSelected
                style={style.normalBtn}

                title={`${PrependZero(pair[1].hours)}:${PrependZero(pair[1].minutes)}`}
                titleProps={{ style: style.normalBtnTxt }}

                onPress={() => {
                  editingExcludeTimePairAndElementIndex.current = [pair, 1]
                  set_showTimePicker(true)
                }}
              />
            </View>

            {/* remove */}
            <LucideIconTextEffectButton
              unselectedColorOfTextAndIcon={theme.counterBackground}
              notChangeToSelected

              iconProps={{ name: 'X', size: FontSize.Normal }}

              onPress={() => onPressRemoveExcludeTime(pair)}
            />
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
  else if (showPopup === 'target-lang')
    contentToRenderInPopup = renderPickTargetLang
  else { // not show any popup
    // reset search lang input

    if (searchLangInputTxt.length > 0)
      set_searchLangInputTxt('')
  }

  let timePickerInitial

  if (editingExcludeTimePairAndElementIndex.current[0] === undefined ||
    editingExcludeTimePairAndElementIndex.current[1] < 0)
    timePickerInitial = GetDayHourMinSecFromMs(displayIntervalInMin * 60 * 1000)
  else {
    const time = editingExcludeTimePairAndElementIndex.current[0][editingExcludeTimePairAndElementIndex.current[1]]

    timePickerInitial = GetDayHourMinSecFromMs((time.hours * 60 + time.minutes) * 60 * 1000)
  }

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

        <Text style={style.header}>{texts.repeat}</Text>

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

        <View style={style.excludeTimeTitleView}>
          <Text style={style.header}>{texts.not_show}</Text>

          {/* add exclude time */}
          <LucideIconTextEffectButton
            unselectedColorOfTextAndIcon={theme.counterBackground}
            notChangeToSelected

            iconProps={{ name: 'Plus', size: FontSize.Normal }}

            onPress={onPressAddExcludeTime}
          />
        </View>

        {
          renderExcludeTimes()
        }

        {/* target lang */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <Text style={style.header}>{texts.translate_to}</Text>

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={displayTargetLang?.name ?? texts.tap_to_select}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Languages', size: FontSize.Normal, }}

          onPress={() => onPressShowPopup('target-lang')}
        />

        {/* test noti */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={texts.test_notification}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Bell', size: FontSize.Normal, }}

          onPress={onPressTestNotification}
        />

        {/* set notification */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        {
          handling &&
          <ActivityIndicator color={theme.counterBackground} />
        }

        {
          !handling &&
          <LucideIconTextEffectButton
            selectedBackgroundColor={theme.primary}

            selectedColorOfTextAndIcon={theme.counterPrimary}
            unselectedColorOfTextAndIcon={theme.counterBackground}

            notChangeToSelected
            manuallySelected={true}
            canHandlePressWhenSelected

            style={style.normalBtn}

            title={texts.set_notification}
            titleProps={{ style: style.normalBtnTxt }}

            iconProps={{ name: 'Rocket', size: FontSize.Normal, }}

            onPress={onPressSetNotification}
          />
        }
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
          onConfirm={onConfirmTimePicker}
          initialHour={timePickerInitial[1]}
          initialMinute={timePickerInitial[2]}
        />
      }
    </View>
  )
}

export default SetupScreen