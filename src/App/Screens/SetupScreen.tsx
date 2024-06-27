import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, ViewProps } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import { Color_BG, Color_Text, Color_Text2 } from '../Hooks/useTheme'
import useLocalText, { NoPermissionText, PleaseSelectTargetLangText } from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { AddS, AlertAsync, ArrayRemove, CloneObject, DateDiff_WithNow, FilterOnlyLetterAndNumberFromString, GetDayHourMinSecFromMs, GetDayHourMinSecFromMs_ToString, IsNumType, IsValuableArrayOrString, PickRandomElementWithCount, PrependZero, RoundWithDecimal, SafeArrayLength, SafeDateString, ToCanPrintError } from '../../Common/UtilsTS'
import SlidingPopup from '../../Common/Components/SlidingPopup'
import { DefaultExcludedTimePairs, DefaultIntervalInMin, IntervalInMinPresets, LimitWordsPerDayPresets, MinimumIntervalInMin, PopuplarityLevelNumber, TranslationServicePresets } from '../Constants/AppConstants'
import TimePicker, { TimePickerResult } from '../Components/TimePicker'
import { LucideIcon } from '../../Common/Components/LucideIcon'
import { PairTime, TranslationService } from '../Types'
import { CalcNotiTimeListPerDay, ClearDbAndNotificationsAsync } from '../Handles/AppUtils'
import { SetupNotificationAsync, TestNotificationAsync } from '../Handles/SetupNotification'
import { GetExcludeTimesAsync, GetDefaultTranslationService, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetPopularityLevelIndexAsync, GetTargetLangAsync, GetTranslationServiceAsync, SetExcludedTimesAsync, SetIntervalMinAsync, SetLimitWordsPerDayAsync, SetTranslationServiceAsync, SetTargetLangAsyncAsync, GetSourceLangAsync } from '../Handles/Settings'
import { DownloadWordDataAsync, GetAllWordsDataCurrentLevelAsync, IsCachedWordsDataCurrentLevelAsync } from '../Handles/WordsData'
import { GetBooleanAsync, GetDateAndSetNowAsync, GetNumberIntAsync, IncreaseNumberAsync, SetBooleanAsync } from '../../Common/AsyncStorageUtils'
import { StorageKey_LastPushTick, StorageKey_LastSetSuccessTick, StorageKey_PopularityIndex, StorageKey_SetPushSuccessCount, StorageKey_ShowDefinitions, StorageKey_ShowExample, StorageKey_ShowPartOfSpeech, StorageKey_ShowPhonetic, StorageKey_ShowRankOfWord, StorageKey_StatusText } from '../Constants/StorageKey'
import HistoryScreen from './HistoryScreen'
import { HandleError, TrackSimpleWithParam, TrackingAsync } from '../../Common/Tracking'
import { GetLanguageFromCode, Language } from '../../Common/TranslationApis/TranslationLanguages'
import { BridgeTranslateMultiWordAsync, GetCurrentTranslationServiceSuitAsync } from '../Handles/TranslateBridge'
import ExampleWordView, { ValueAndDisplayText } from './ExampleWordView'
import { SqlLogAllRowsAsync } from '../../Common/SQLite'
import TargetLangPicker from '../Components/TargetLangPicker'
import SettingItemPanel, { SettingItemPanelStyle } from '../Components/SettingItemPanel'
import About from './About'
import { usePostHog } from 'posthog-react-native'
import { AppContext, AppName } from '../../Common/SpecificConstants'
import useSpecificAppContext from '../../Common/Hooks/useSpecificAppContext'
import { IsDev } from '../../Common/IsDev'
import HairLine from '../../Common/Components/HairLine'
import { StartupWindowSize } from '../../Common/CommonConstants'
import { HandleBeforeShowPopupPopularityLevelForNoPremiumAsync } from '../Handles/PremiumHandler'
import { LoopSetValueFirebase } from '../../Common/Firebase/LoopSetValueFirebase'
import { GetUserPropertyFirebasePath } from '../../Common/UserMan'
import { UserSelectedPopularityIndexProperty } from '../../Common/SpecificType'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ScaleUpView from '../../Common/Components/Effects/ScaleUpView'

const IsLog = false

const EffectScaleUpOffset = 100

const ExcludeTimeTrackEventName = 'exclude_time'

export type SubView =
  'setup' |
  'history' |
  'about'

type PopupType =
  'popularity' |
  'interval' |
  'limit_word' |
  'target_lang' |
  'translation_service' |
  undefined

export type HandlingType =
  'downloading' |
  'loading_local' |
  'setting_notification' |
  'done' |
  undefined

const SetupScreen = () => {
  const posthog = usePostHog()
  const texts = useLocalText()

  const [handlingType, set_handlingType] = useState<HandlingType>(undefined)
  const [pointerEvents, set_pointerEvents] = useState<ViewProps['pointerEvents']>('auto')
  const [processPercent, set_processPercent] = useState<'' | `${number}%`>('')
  const [subView, set_subView] = useState<SubView>('setup')
  const [pushTimeListText, set_pushTimeListText] = useState('')
  const [useEFfectLoaded, set_useEFfectLoaded] = useState(false)
  const [showPopup, set_showPopup] = useState<PopupType>(undefined)
  const popupCloseCallbackRef = useRef<(onFinished?: () => void) => void>()

  const [displayPopularityLevelIdx, set_displayPopularityLevelIdx] = useState(0)
  const [displayIntervalInMin, set_displayIntervalInMin] = useState<number>(DefaultIntervalInMin)
  const [displayWordLimitNumber, set_displayWordLimitNumber] = useState<number>(5)

  const [displayTargetLang, set_displayTargetLang] = useState<Language | undefined>()
  const [timestampLastPush, set_timestampLastPush] = useState(0)

  const [displayTranslationService, set_displayTranslationService] = useState<TranslationService>(GetDefaultTranslationService())

  const [displayExcludedTimePairs, set_displayExcludedTimePairs] = useState<PairTime[]>(DefaultExcludedTimePairs)
  const editingExcludeTimePairAndElementIndex = useRef<[PairTime | undefined, number]>([undefined, -1])

  const [showTimePicker, set_showTimePicker] = useState(false)
  const [showMoreSetting, set_showMoreSetting] = useState(false)

  const [displaySettting_ShowPhonetic, set_displaySettting_ShowPhonetic] = useState(false)
  const [displaySettting_ShowPartOfSpeech, set_displaySettting_ShowPartOfSpeech] = useState(false)
  const [displaySettting_Definitions, set_displaySettting_Definitions] = useState(false)
  const [displaySettting_RankOfWord, set_displaySettting_RankOfWord] = useState(false)
  const [displaySettting_Example, set_displaySettting_Example] = useState(false)

  // common

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1 },
      scrollView: { gap: Gap.Normal, padding: Outline.Normal, },

      topbarView: { flexDirection: 'row' },
      topbarBtn: { flexDirection: 'row', padding: Outline.Small, gap: Gap.Small, flex: 1 },

      scrollViewSlidingPopup: { gap: Gap.Small, padding: Outline.Normal, },

      excludeTimeView: { flexDirection: 'row', gap: Gap.Normal, alignItems: 'center' },
      excludeTimeChildView: { flex: 1, },
      excludeTimeTitleView: { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },

      excludedTimeBtn: {
        borderWidth: 0,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Small,
      },

      normalBtnTxt: { fontSize: FontSize.Normal, },

      alreadySetInfoTxt: {
        color: Color_Text2,
        fontSize: FontSize.Small,
        paddingHorizontal: Outline.Normal,
        paddingBottom: Outline.Small,
        textAlign: 'center',
      },

      downloadingView: { padding: Outline.Normal, gap: Gap.Normal, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute', backgroundColor: Color_BG },
      downloadingTxt: { fontSize: FontSize.Normal, fontWeight: FontBold.Bold, color: Color_Text },

      doneView: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        gap: Gap.Normal,
      },

      doneTimeView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: Gap.Normal,
      },

      normalBtn: {
        borderWidth: 0,
        borderRadius: BorderRadius.Small,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
        flex: 1,
      },

      normalBtn_NoBorder: {
        padding: Outline.Normal,
      },

      displaySettingBtn: {
        flexDirection: 'row',
        gap: Gap.Normal,
        justifyContent: 'flex-start',
      },

      handlingBackBtn: {
        borderWidth: 0,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        width: '50%',
      },

      moreSettingBtn: {
        flexDirection: 'row',
        gap: Gap.Normal,
      },

      bottomButtonsView: {
        flexDirection: 'row',
        gap: Gap.Normal,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Outline.Normal,
      },
    })
  }, [])

  const alreadySetInfoTxt = useMemo(() => {
    if (!IsNumType(timestampLastPush))
      return undefined

    if (timestampLastPush > Date.now()) {
      const lastSetDate = new Date(timestampLastPush)

      return texts.already_set
        .replace('24/Oct/1994', SafeDateString(lastSetDate, '/'))
        .replace('00:00', `${PrependZero(lastSetDate.getHours())}:${PrependZero(lastSetDate.getMinutes())}`)
    }
    else
      return texts.expired_set
  }, [timestampLastPush, texts])

  const onActiveOrUseEffectOnceAsync = useCallback(async (isUseEffectOnceOrOnActive: boolean) => {
    const lastPushTick = await GetNumberIntAsync(StorageKey_LastPushTick)
    set_timestampLastPush(lastPushTick)

    if (IsLog)
      console.log("[onActiveOrUseEffectOnceAsync] isUseEffectOnceOrOnActive", isUseEffectOnceOrOnActive);
  }, []) // must []

  const generatePushTimeListText = useCallback((lastSetTimestamp: number) => {
    const pushTimesPerDay = CalcNotiTimeListPerDay(displayIntervalInMin, displayExcludedTimePairs)

    const arr = []

    for (let time of pushTimesPerDay) {
      arr.push(`${PrependZero(time.hours)}:${PrependZero(time.minutes)}`)
    }

    let combineText = ''

    if (arr.length >= 2) {
      combineText = `${arr.slice(0, arr.length - 1).join(', ')} ${texts.and} ${arr[arr.length - 1]}`
    }
    else if (arr.length >= 1)
      combineText = arr[0]

    const lastSetDate = new Date(lastSetTimestamp)

    const text = texts.push_notice
      .replace('24/Oct/1994', SafeDateString(lastSetDate, '/'))
      .replace('00:00', `${PrependZero(lastSetDate.getHours())}:${PrependZero(lastSetDate.getMinutes())}`)
      .replace('###', combineText)

    set_pushTimeListText(text)

    AsyncStorage.setItem(StorageKey_StatusText, text)
  }, [displayIntervalInMin, displayExcludedTimePairs])

  const onPressStatusInfo = useCallback(async () => {
    if (alreadySetInfoTxt === undefined || alreadySetInfoTxt === texts.expired_set)
      return

    const text = await AsyncStorage.getItem(StorageKey_StatusText)

    if (!text)
      return

    Alert.alert(AppName, text)
  }, [texts, alreadySetInfoTxt])

  const onPressSubview = useCallback((type: SubView) => {
    set_subView(type)
  }, [])

  const onPressMoreSetting = useCallback(() => {
    set_showMoreSetting(v => !v)
  }, [displayTargetLang])

  const getExcludeTimesAsStringForTracking = useCallback((): string => {
    if (!IsValuableArrayOrString(displayExcludedTimePairs))
      return ''

    const pairAsStringArr = displayExcludedTimePairs.map(pair => {
      const start = `${PrependZero(pair[0].hours)}:${PrependZero(pair[0].minutes)}`
      const end = `${PrependZero(pair[1].hours)}:${PrependZero(pair[1].minutes)}`

      return `[${start}-${end}]`
    })

    return pairAsStringArr.join('')
  }, [displayExcludedTimePairs])

  const trackAfterSetNotificationSuccessAsync = useCallback(async () => {
    // track strings =====================

    const excludeTimes = getExcludeTimesAsStringForTracking()
    const service = FilterOnlyLetterAndNumberFromString(displayTranslationService)

    const targetLang = displayTargetLang ?
      FilterOnlyLetterAndNumberFromString(displayTargetLang.name) :
      ''

    await TrackingAsync(
      'push_success_strings',
      [
        // translation Service
        `total/service/${service}`,

        // target lang
        `total/target_lang/${targetLang}`,
      ],
      {
        excludeTimes,
        service,
        targetLang,
      } as Record<string, string>
    )

    // track numbers ======================

    const isIntervalInPresets = IntervalInMinPresets.includes(displayIntervalInMin)

    const displaySettingFirebasePaths: string[] = []

    if (displaySettting_ShowPhonetic)
      displaySettingFirebasePaths.push(`total/display/phonetic`)
    if (displaySettting_Example)
      displaySettingFirebasePaths.push(`total/display/example`)
    if (displaySettting_Definitions)
      displaySettingFirebasePaths.push(`total/display/definition`)
    if (displaySettting_RankOfWord)
      displaySettingFirebasePaths.push(`total/display/rank`)
    if (displaySettting_ShowPartOfSpeech)
      displaySettingFirebasePaths.push(`total/display/part`)

    const setSuccessCount = await IncreaseNumberAsync(StorageKey_SetPushSuccessCount)

    const lastSetTick = await GetDateAndSetNowAsync(StorageKey_LastSetSuccessTick)
    const lastSetInDays = lastSetTick === undefined ? 0 : RoundWithDecimal(DateDiff_WithNow(lastSetTick))

    const excludeTimePairs = SafeArrayLength(displayExcludedTimePairs)

    await TrackingAsync(
      'push_success_numbers',
      [
        // popularity
        `total/popularity/index_${displayPopularityLevelIdx}`,

        // limit word
        `total/limit_word/${displayWordLimitNumber}_words`,
        
        // exclude Time Pairs
        `total/exclude_time/count/${excludeTimePairs}_pairs`,

        // interval
        isIntervalInPresets ?
          `total/inteval/${displayIntervalInMin}m` :
          `total/inteval/custom`,

        // display Setting
        ...displaySettingFirebasePaths,
      ],
      {
        popularityIdx: displayPopularityLevelIdx,
        intervalInMin: displayIntervalInMin,
        limitWords: displayWordLimitNumber,
        setSuccessCount,
        lastSetInDays,
        excludeTimePairs,
        
        showPhonetic: displaySettting_ShowPhonetic ? 1 : 0,
        showRankOfWord: displaySettting_RankOfWord ? 1 : 0,
        showDefinitions: displaySettting_Definitions ? 1 : 0,
        showExample: displaySettting_Example ? 1 : 0,
        showPartOfSpeech: displaySettting_ShowPartOfSpeech ? 1 : 0,
      } as Record<string, number>
    )
  }, [
    getExcludeTimesAsStringForTracking,

    displayPopularityLevelIdx,
    displayIntervalInMin,
    displayWordLimitNumber,
    displayTranslationService,
    displayTargetLang,
    displayExcludedTimePairs,

    displaySettting_ShowPartOfSpeech,
    displaySettting_ShowPhonetic,
    displaySettting_Example,
    displaySettting_RankOfWord,
    displaySettting_Definitions
  ])

  /**
   * during handle if download failed, an alert showed up
   * @returns ensuring data got cached
   */
  const setHandlingAndGetReadyDataAsync = async (popularityLevelIdx = -1): Promise<boolean> => {
    if (await IsCachedWordsDataCurrentLevelAsync(popularityLevelIdx))
      return true

    set_handlingType('loading_local')

    if (popularityLevelIdx < 0)
      popularityLevelIdx = await GetPopularityLevelIndexAsync()

    // check if data available 

    const words = await GetAllWordsDataCurrentLevelAsync(popularityLevelIdx)

    // need to dl

    if (words === undefined) {
      set_handlingType('downloading')

      while (true) {
        const dlRes = await DownloadWordDataAsync(popularityLevelIdx)

        if (dlRes !== undefined) { // dl fail
          const isPressRight = await AlertAsync(
            texts.popup_error,
            `${texts.fail_download}\n\n${ToCanPrintError(dlRes)}`,
            texts.retry, // right btn
            texts.cancel) // left btn

          if (!isPressRight) { // cancel
            set_handlingType(undefined)
            return false
          }
        }
        else // dl success
          return await setHandlingAndGetReadyDataAsync(popularityLevelIdx)
      }
    }

    // data ok!

    set_handlingType(undefined)

    return true
  }

  const getExampleWordsAsync = useCallback(async (
    service?: TranslationService,
    popularityLevelIdx?: number,
    targetLang?: string | null,
    notTranslate?: boolean
  ): Promise<boolean | Error | ValueAndDisplayText[]> => {
    if (IsLog)
      console.log('[getExampleWordsAsync] notTranslate', notTranslate);

    const dataReady = await setHandlingAndGetReadyDataAsync(popularityLevelIdx)

    if (!dataReady)
      return false

    const allWords = await GetAllWordsDataCurrentLevelAsync(popularityLevelIdx)

    if (allWords === undefined) // ts
      return false

    const randomWords = PickRandomElementWithCount(allWords, 10)

    if (randomWords === undefined) // ts
      return false

    if (notTranslate === true) {
      return randomWords.map(t => {
        const res: ValueAndDisplayText = {
          value: t.word,
          text: t.word,
        }

        return res
      })
    }

    if (typeof targetLang !== 'string')
      targetLang = await GetTargetLangAsync()

    if (!targetLang) {
      return new Error(PleaseSelectTargetLangText)
    }

    const translatedsOrError = await BridgeTranslateMultiWordAsync(
      randomWords.map(w => w.word),
      targetLang,
      await GetSourceLangAsync(),
      service,
      false
    )

    if (!Array.isArray(translatedsOrError))
      return translatedsOrError

    return translatedsOrError.map(t => {
      const res: ValueAndDisplayText = {
        value: t.translated,
        text: t.text,
      }

      return res
    })
  }, [setHandlingAndGetReadyDataAsync])

  const onPressTestNotificationAsync = useCallback(async () => {
    const dataReady = await setHandlingAndGetReadyDataAsync()

    if (!dataReady)
      return

    const res = await TestNotificationAsync(set_handlingType)

    if (res?.message) {
      HandleError(res, 'onPressTestNotificationAsync', true, res?.message !== NoPermissionText)
    }
  }, [setHandlingAndGetReadyDataAsync])

  const onPressSetNotification = useCallback(async () => {
    const dataReady = await setHandlingAndGetReadyDataAsync()

    if (!dataReady)
      return

    set_handlingType('setting_notification')

    const lastSetTimestampOrError = await SetupNotificationAsync(
      texts,
      (process) => {
        set_processPercent(`${RoundWithDecimal(process * 100)}%`)
      }
    )

    if (IsNumType(lastSetTimestampOrError)) { // success
      set_handlingType('done')
      set_timestampLastPush(lastSetTimestampOrError)
      generatePushTimeListText(lastSetTimestampOrError)

      // track

      trackAfterSetNotificationSuccessAsync()
    }
    else { // error
      let s = lastSetTimestampOrError.errorText ? texts[lastSetTimestampOrError.errorText] : ''
      const trackFirebase = s !== texts.no_permission

      if (lastSetTimestampOrError.error) {
        if (s !== '')
          s += '\n\n'

        s += ToCanPrintError(lastSetTimestampOrError.error)
      }

      HandleError(s, 'onPressSetNotification', true, trackFirebase)

      set_handlingType(undefined)
    }

    // reset

    set_processPercent('')
  }, [texts, setHandlingAndGetReadyDataAsync, generatePushTimeListText, trackAfterSetNotificationSuccessAsync])

  const checkSetInterval = useCallback((minutes: number) => {
    if (minutes < MinimumIntervalInMin) {
      Alert.alert('Oooops', texts.interval_minimum_required.replace('##', MinimumIntervalInMin.toString()))
      return
    }

    set_displayIntervalInMin(minutes)
    SetIntervalMinAsync(minutes)
  }, [texts])

  const onConfirmTimePicker = useCallback((time: TimePickerResult) => {
    if (editingExcludeTimePairAndElementIndex.current[0] === undefined ||
      editingExcludeTimePairAndElementIndex.current[1] === -1
    ) { // set for interval
      const min = time.hours * 60 + time.minutes
      checkSetInterval(min)
    }
    else { // for exclude time
      editingExcludeTimePairAndElementIndex.current[0][editingExcludeTimePairAndElementIndex.current[1]] = time
      editingExcludeTimePairAndElementIndex.current = [undefined, -1]

      const obj = CloneObject(displayExcludedTimePairs)

      set_displayExcludedTimePairs(obj)

      SetExcludedTimesAsync(obj)
    }
  }, [checkSetInterval, displayExcludedTimePairs])

  const {
    appContextValue,
    onSetSubcribeDataAsync
  } = useSpecificAppContext({
    posthog,
    onActiveOrUseEffectOnceAsync
  })

  const onPressShowPopupAsync = useCallback(async (type: PopupType) => {
    let canOpen = true

    if (appContextValue.subscribedData === undefined && type === 'popularity') {
      set_pointerEvents('none')

      canOpen = await HandleBeforeShowPopupPopularityLevelForNoPremiumAsync(
        set_subView,
        texts
      )

      set_pointerEvents(undefined)
    }

    if (!canOpen)
      return

    set_showPopup(type)

    TrackSimpleWithParam('show_popup', type as string)
  }, [texts, onSetSubcribeDataAsync, appContextValue])

  // noti display

  const onPressDisplaySetting = useCallback((storageKey: string, setter: typeof set_displaySettting_ShowPhonetic) => {
    setter(val => {
      const toValue = !val

      SetBooleanAsync(storageKey, toValue)

      // return

      return toValue
    })
  }, [texts])

  const renderDisplaySettingItem = useCallback((
    title: string,
    getter: boolean,
    setter: typeof set_displaySettting_ShowPhonetic,
    storeKey: string,
  ) => {
    return (
      <LucideIconTextEffectButton
        unselectedColorOfTextAndIcon={Color_Text}
        notChangeToSelected
        style={style.displaySettingBtn}

        title={title}
        titleProps={{ numberOfLines: 1, adjustsFontSizeToFit: true, style: style.normalBtnTxt }}

        iconProps={{ name: getter ? 'CheckSquare' : 'Square', size: FontSize.Normal, }}

        onPress={() => onPressDisplaySetting(storeKey, setter)}
      />
    )
  }, [style])

  // popularity

  const popularityValueAndDisplayTexts = useMemo(() => {
    return Array(PopuplarityLevelNumber).fill(undefined).map((_, index) => {
      const s: ValueAndDisplayText = {
        value: index,
        text: (
          texts.level +
          ' ' +
          (index + 1) +
          (index === 0 ?
            `\n(${texts.most_popular})` :
            (index === PopuplarityLevelNumber - 1 ? `\n(${texts.rarest})` : '')
          )
        )
      }

      return s
    })
  }, [TranslationServicePresets, texts])

  const onPressConfirmInPopupPopularityLevel = useCallback((value?: ValueAndDisplayText, targetLang?: Language) => {
    if (!popupCloseCallbackRef.current)
      return

    popupCloseCallbackRef.current(async () => { // on closed
      if (!value)
        return

      const popularityLevelIdx = value.value

      // make sure data is ready

      const dataReady = await setHandlingAndGetReadyDataAsync(popularityLevelIdx)

      if (!dataReady)
        return

      // save local & firebase

      LoopSetValueFirebase.SetValueAsync(
        StorageKey_PopularityIndex,
        GetUserPropertyFirebasePath(UserSelectedPopularityIndexProperty),
        popularityLevelIdx,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      )

      // set UI

      set_displayPopularityLevelIdx(popularityLevelIdx)
    })
  }, [setHandlingAndGetReadyDataAsync])

  const renderPopularityLevels = useCallback(() => {
    return (
      <ExampleWordView
        notTranslate
        trackType='popularity'
        onConfirmValue={onPressConfirmInPopupPopularityLevel}
        getExampleAsync={getExampleWordsAsync}
        titleLeft={texts.level}
        titleRight={texts.example_words}
        values={popularityValueAndDisplayTexts}
        initValue={popularityValueAndDisplayTexts.find(i => i.value === displayPopularityLevelIdx)}
      />
    )
  }, [
    style,
    onPressConfirmInPopupPopularityLevel,
    getExampleWordsAsync,
    popularityValueAndDisplayTexts,
    displayPopularityLevelIdx
  ])

  // interval (repeat)

  const repeatValueAndDisplayText = useMemo(() => {
    let res: ValueAndDisplayText

    if (displayIntervalInMin % 60 === 0) {
      const h = Math.floor(displayIntervalInMin / 60)

      res = {
        value: h,
        text: texts.hour
      }
    }
    else {
      res = {
        value: displayIntervalInMin,
        text: texts.minute
      }
    }

    return res
  }, [displayIntervalInMin])

  const onPressInterval = useCallback((minutesOrCustom: number | undefined) => {
    if (popupCloseCallbackRef.current)
      popupCloseCallbackRef.current(() => { // on closed
        if (!IsNumType(minutesOrCustom)) // open custom timer
          set_showTimePicker(true)
        else { // set value
          checkSetInterval(minutesOrCustom)
        }
      })
  }, [texts, checkSetInterval])

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

                selectedColorOfTextAndIcon={Color_Text}
                unselectedColorOfTextAndIcon={Color_BG}

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
  }, [displayIntervalInMin, style])

  // limit words

  const onPressLimitWord = useCallback((wordNum: number) => {
    if (wordNum !== undefined)
      set_displayWordLimitNumber(wordNum)

    if (popupCloseCallbackRef.current) {
      popupCloseCallbackRef.current(() => {
        SetLimitWordsPerDayAsync(wordNum)
      })
    }
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

                selectedColorOfTextAndIcon={Color_Text}
                unselectedColorOfTextAndIcon={Color_BG}

                onPress={() => onPressLimitWord(wordNum)}

                manuallySelected={isSelected}
                notChangeToSelected
                canHandlePressWhenSelected

                style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                title={wordNum <= 0 ? texts.no_limit : (wordNum + ' ' + AddS(texts.word, wordNum))}

                titleProps={{ style: style.normalBtnTxt }}
              />
            )
          })
        }
      </ScrollView>
    )
  }, [displayWordLimitNumber, style])

  // translate service

  const translationServiceValueAndDisplayTexts = useMemo(() => {
    return TranslationServicePresets.map(service => {
      const s: ValueAndDisplayText = {
        value: service,
        text: service
      }

      return s
    })
  }, [TranslationServicePresets])

  const handleChangedTranslationServiceAsync = useCallback(async (service: TranslationService, targetLang: Language, resetData: boolean) => {
    // Translation Service

    set_displayTranslationService(service)
    SetTranslationServiceAsync(service)

    // target lang

    set_displayTargetLang(targetLang)
    SetTargetLangAsyncAsync(targetLang.language)

    // reset db

    if (resetData) {
      // await SqlLogAllRowsAsync('LocalizedWordsTable')
      await ClearDbAndNotificationsAsync()
      await SqlLogAllRowsAsync('LocalizedWordsTable')
    }
  }, [])

  const onPressOpenPopupChangeTranslationService = useCallback(() => {
    if (!displayTargetLang) {
      Alert.alert(
        texts.popup_error,
        texts.pls_set_target_lang, [
        {
          onPress: () => onPressShowPopupAsync('target_lang')
        }
      ])

      return
    }

    onPressShowPopupAsync('translation_service')
  }, [displayTargetLang, onPressShowPopupAsync, texts])

  const onPressConfirmInPopupTranslationService = useCallback((service?: ValueAndDisplayText, targetLang?: Language) => {
    if (!popupCloseCallbackRef.current)
      return

    popupCloseCallbackRef.current(() => { // closed
      if (!service || !targetLang)
        return

      const serv = service.text as TranslationService

      if (displayTranslationService === serv)
        return

      Alert.alert(
        texts.confirm,
        texts.warning_clear_db,
        [
          {
            text: texts.confirm,
            onPress: () => {
              handleChangedTranslationServiceAsync(serv, targetLang, true)
            }
          },

          {
            text: texts.cancel
          }
        ]
      )
    })
  }, [texts, displayTranslationService, handleChangedTranslationServiceAsync])

  const renderPickTranslationService = useCallback(() => {
    return (
      <ExampleWordView
        initTargetLang={displayTargetLang}
        trackType='translation_service'
        onConfirmValue={onPressConfirmInPopupTranslationService}
        getExampleAsync={getExampleWordsAsync}
        titleLeft={texts.services}
        titleRight={texts.example_words}
        values={translationServiceValueAndDisplayTexts}
        initValue={translationServiceValueAndDisplayTexts.find(i => i.value === displayTranslationService)}
      />
    )
  }, [
    displayTranslationService,
    displayTargetLang,
    getExampleWordsAsync,
    translationServiceValueAndDisplayTexts,
    style
  ])

  // target lang

  const onPressTargetLang = useCallback((lang: Language) => {

    if (popupCloseCallbackRef.current) {
      popupCloseCallbackRef.current(() => {
        set_displayTargetLang(lang)
        SetTargetLangAsyncAsync(lang.language)
      })
    }
  }, [])

  const renderPickTargetLang = useCallback(() => {
    return (
      <TargetLangPicker
        delayShow
        onPressTargetLang={onPressTargetLang}
        initTargetLang={displayTargetLang}
        selectingService={displayTranslationService}
      />
    )
  }, [displayTargetLang, onPressTargetLang, displayTranslationService])

  // exclude time

  const onPressAddExcludeTime = useCallback(() => {
    displayExcludedTimePairs.push(DefaultExcludedTimePairs[0])

    const obj = CloneObject(displayExcludedTimePairs)

    set_displayExcludedTimePairs(obj)

    SetExcludedTimesAsync(obj)

    // track

    TrackSimpleWithParam(ExcludeTimeTrackEventName, 'add')
  }, [displayExcludedTimePairs])

  const onPressRemoveExcludeTime = useCallback((pair: PairTime) => {
    ArrayRemove(displayExcludedTimePairs, pair)

    const obj = CloneObject(displayExcludedTimePairs)

    set_displayExcludedTimePairs(obj)

    SetExcludedTimesAsync(obj)

    TrackSimpleWithParam(ExcludeTimeTrackEventName, 'remove')
  }, [displayExcludedTimePairs])

  const renderExcludeTimes = useCallback(() => {
    return (
      displayExcludedTimePairs.map((pair: PairTime, index: number) => {
        return (
          <View key={index} style={style.excludeTimeView}>
            {/* from */}
            <View style={style.excludeTimeChildView}>
              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={Color_Text}
                notChangeToSelected
                style={style.excludedTimeBtn}

                title={`${PrependZero(pair[0].hours)}:${PrependZero(pair[0].minutes)}`}
                titleProps={{ style: style.normalBtnTxt }}

                onPress={() => {
                  editingExcludeTimePairAndElementIndex.current = [pair, 0]
                  set_showTimePicker(true)
                }}
              />
            </View>

            {/* arrow icon */}
            <LucideIcon name='MoveRight' color={Color_Text} />

            {/* to */}
            <View style={style.excludeTimeChildView}>
              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={Color_Text}
                notChangeToSelected
                style={style.excludedTimeBtn}

                title={`${PrependZero(pair[1].hours)}:${PrependZero(pair[1].minutes)}`}
                titleProps={{ style: style.normalBtnTxt }}

                onPress={() => {
                  editingExcludeTimePairAndElementIndex.current = [pair, 1]
                  set_showTimePicker(true)
                }}
              />
            </View>

            {/* remove btn */}
            <LucideIconTextEffectButton
              unselectedColorOfTextAndIcon={Color_Text}
              notChangeToSelected

              iconProps={{ name: 'X', size: FontSize.Normal }}

              onPress={() => onPressRemoveExcludeTime(pair)}
            />
          </View>
        )
      })
    )
  }, [displayExcludedTimePairs, style])

  // common

  let contentToRenderInPopup = undefined
  let timePickerInitial = [0, 0, 0, 0]

  if (showPopup === 'popularity')
    contentToRenderInPopup = renderPopularityLevels
  else if (showPopup === 'interval')
    contentToRenderInPopup = renderIntervals
  else if (showPopup === 'limit_word')
    contentToRenderInPopup = renderWordLimits
  else if (showPopup === 'target_lang')
    contentToRenderInPopup = renderPickTargetLang
  else if (showPopup === 'translation_service')
    contentToRenderInPopup = renderPickTranslationService
  else { // not show any popup
    if (editingExcludeTimePairAndElementIndex.current[0] === undefined ||
      editingExcludeTimePairAndElementIndex.current[1] < 0)
      timePickerInitial = GetDayHourMinSecFromMs(displayIntervalInMin * 60 * 1000)
    else {
      const time = editingExcludeTimePairAndElementIndex.current[0][editingExcludeTimePairAndElementIndex.current[1]]

      timePickerInitial = GetDayHourMinSecFromMs((time.hours * 60 + time.minutes) * 60 * 1000)
    }
  }

  // load setting (once)

  useEffect(() => {
    (async () => {
      const [
        levelPopularity,
        intervalInMin,
        limitWordsPerDay,
        excludedTimePairs,
        service,
        targetLang,
        showPhonetic,
        showRankOfWord,
        showDefinitions,
        showExample,
        showPartOfSpeech
      ] = await Promise.all([
        GetPopularityLevelIndexAsync(),
        GetIntervalMinAsync(),
        GetLimitWordsPerDayAsync(),
        GetExcludeTimesAsync(),
        GetTranslationServiceAsync(),
        GetTargetLangAsync(),
        GetBooleanAsync(StorageKey_ShowPhonetic),
        GetBooleanAsync(StorageKey_ShowRankOfWord),
        GetBooleanAsync(StorageKey_ShowDefinitions),
        GetBooleanAsync(StorageKey_ShowExample),
        GetBooleanAsync(StorageKey_ShowPartOfSpeech)
      ]);

      const suit = await GetCurrentTranslationServiceSuitAsync(service);

      const targetLanguage = targetLang
        ? GetLanguageFromCode(targetLang, suit.supportedLanguages)
        : undefined;

      set_displayTargetLang(targetLanguage);
      set_displayPopularityLevelIdx(levelPopularity);
      set_displayIntervalInMin(intervalInMin);
      set_displayWordLimitNumber(limitWordsPerDay);
      set_displayExcludedTimePairs(excludedTimePairs);
      set_displayTranslationService(service);

      set_displaySettting_ShowPhonetic(showPhonetic);
      set_displaySettting_RankOfWord(showRankOfWord);
      set_displaySettting_Definitions(showDefinitions);
      set_displaySettting_Example(showExample);
      set_displaySettting_ShowPartOfSpeech(showPartOfSpeech);

      // show target lang on top

      setTimeout(() => {
        set_useEFfectLoaded(true)
      }, targetLang ? 0 : 500);
    })()
  }, [])

  // render

  return (
    <AppContext.Provider value={appContextValue} >
      <View pointerEvents={pointerEvents} style={style.master}>
        {/* topbar */}
        <View style={style.topbarView}>
          <LucideIconTextEffectButton
            unselectedColorOfTextAndIcon={Color_Text2}
            selectedColorOfTextAndIcon={Color_Text}
            selectedBackgroundColor={Color_BG}

            style={style.topbarBtn}

            title={texts.history}
            titleProps={{ style: style.normalBtnTxt }}

            manuallySelected={subView === 'history'}
            onPress={() => onPressSubview('history')}
          />
          <LucideIconTextEffectButton
            unselectedColorOfTextAndIcon={Color_Text2}
            selectedColorOfTextAndIcon={Color_Text}
            selectedBackgroundColor={Color_BG}

            style={style.topbarBtn}

            title={texts.setup}
            titleProps={{ style: style.normalBtnTxt }}

            manuallySelected={subView === 'setup'}
            onPress={() => onPressSubview('setup')}
          />
          <LucideIconTextEffectButton
            unselectedColorOfTextAndIcon={Color_Text2}
            selectedColorOfTextAndIcon={Color_Text}
            selectedBackgroundColor={Color_BG}

            style={style.topbarBtn}

            title={`${texts.about}${IsDev() ? '.' : ''}`}
            titleProps={{ style: style.normalBtnTxt }}

            manuallySelected={subView === 'about'}
            onPress={() => onPressSubview('about')}
          />
        </View>

        {/* main ui - scroll view */}

        {
          subView === 'setup' &&
          <ScrollView contentContainerStyle={style.scrollView} showsVerticalScrollIndicator={false}>
            {/* target lang */}

            {
              !displayTargetLang && useEFfectLoaded &&
              <ScaleUpView delay={EffectScaleUpOffset * 0}>
                <SettingItemPanel
                  onPress={() => onPressShowPopupAsync('target_lang')}
                  title={texts.translate_to}
                  explain={texts.translate_language_explain}
                  value={'?'}
                  isLong
                />
              </ScaleUpView>
            }

            {/* popularity_level */}

            <ScaleUpView delay={EffectScaleUpOffset * 0}>
              <SettingItemPanel
                onPress={() => onPressShowPopupAsync('popularity')}
                title={texts.popularity_level}
                explain={texts.popularity_level_explain}
                value={displayPopularityLevelIdx + 1}
                unit={texts.level}
              />
            </ScaleUpView>

            {/* repeat */}

            <ScaleUpView delay={EffectScaleUpOffset * 1}>
              <SettingItemPanel
                onPress={() => onPressShowPopupAsync('interval')}
                title={texts.repeat}
                explain={texts.repeat_explain}
                value={repeatValueAndDisplayText.value}
                unit={repeatValueAndDisplayText.text}
              />
            </ScaleUpView>

            {/* display of noti */}

            <ScaleUpView delay={EffectScaleUpOffset * 2}>
              <View style={SettingItemPanelStyle.master_Column}>
                {/* title */}
                <Text style={SettingItemPanelStyle.titleTxt}>{texts.noti_display}</Text>

                {/* explain */}
                <Text style={SettingItemPanelStyle.explainTxt}>
                  {texts.noti_display_explain.replace('##', texts.test_notification)}
                </Text>

                {/* display of noti - phonetic */}

                {
                  renderDisplaySettingItem(
                    texts.show_phonetic,
                    displaySettting_ShowPhonetic,
                    set_displaySettting_ShowPhonetic,
                    StorageKey_ShowPhonetic
                  )
                }

                {/* display of noti - part of speech */}

                {
                  renderDisplaySettingItem(
                    texts.show_part_of_speech,
                    displaySettting_ShowPartOfSpeech || displaySettting_Example || displaySettting_Definitions,
                    set_displaySettting_ShowPartOfSpeech,
                    StorageKey_ShowPartOfSpeech
                  )
                }

                {/* display of noti - definitions */}

                {
                  renderDisplaySettingItem(
                    texts.show_definitions,
                    displaySettting_Definitions,
                    set_displaySettting_Definitions,
                    StorageKey_ShowDefinitions
                  )
                }

                {/* display of noti - example */}

                {
                  renderDisplaySettingItem(
                    texts.show_examble,
                    displaySettting_Example,
                    set_displaySettting_Example,
                    StorageKey_ShowExample
                  )
                }

                {/* display of noti - rank */}

                {
                  renderDisplaySettingItem(
                    texts.show_rank_of_word,
                    displaySettting_RankOfWord,
                    set_displaySettting_RankOfWord,
                    StorageKey_ShowRankOfWord
                  )
                }
              </View>
            </ScaleUpView>

            {/* more setting */}

            <LucideIconTextEffectButton
              unselectedColorOfTextAndIcon={Color_Text2}
              notChangeToSelected
              style={style.moreSettingBtn}

              title={texts.more_setting}

              titleProps={{ style: style.normalBtnTxt }}

              iconProps={{ name: showMoreSetting ? 'ChevronUp' : 'ChevronDown', size: FontSize.Normal, }}

              onPress={onPressMoreSetting}
            />

            {/* exclude time */}

            {
              showMoreSetting &&
              <View style={SettingItemPanelStyle.master_Column}>
                {/* title */}
                <View style={style.excludeTimeTitleView}>
                  <Text style={SettingItemPanelStyle.titleTxt}>{texts.not_show}</Text>

                  {/* add exclude time btn */}
                  <LucideIconTextEffectButton
                    unselectedColorOfTextAndIcon={Color_Text}
                    notChangeToSelected

                    iconProps={{ name: 'Plus', size: FontSize.Normal }}

                    onPress={onPressAddExcludeTime}
                  />
                </View>

                {/* explain */}
                <Text style={SettingItemPanelStyle.explainTxt}>{texts.not_show_explain}</Text>

                {/* list */}
                {
                  renderExcludeTimes()
                }
              </View>
            }

            {/* limit words */}

            {
              showMoreSetting &&
              <SettingItemPanel
                onPress={() => onPressShowPopupAsync('limit_word')}
                title={texts.limit_words_per_day}
                explain={texts.limit_words_per_day_explain}
                value={displayWordLimitNumber <= 0 ? texts.no_limit : displayWordLimitNumber}
                unit={AddS(texts.word, displayWordLimitNumber)}
              />
            }

            {/* translate service */}

            {
              showMoreSetting &&
              <SettingItemPanel
                onPress={onPressOpenPopupChangeTranslationService}
                title={texts.translation_service}
                explain={texts.services_explain}
                value={displayTranslationService.split(' ')[0]}
                isLong
              />
            }

            {/* target lang */}

            {
              showMoreSetting &&
              < SettingItemPanel
                onPress={() => onPressShowPopupAsync('target_lang')}
                title={texts.translate_to}
                explain={texts.translate_language_explain}
                value={displayTargetLang?.name ?? '?'}
                isLong
              />
            }
          </ScrollView>
        }

        {/* set notification & test btn */}

        {
          subView === 'setup' &&
          <>
            <View style={style.bottomButtonsView}>
              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={Color_Text}

                notChangeToSelected
                style={style.normalBtn}

                title={texts.test_notification}
                titleProps={{ style: style.normalBtnTxt }}

                onPress={onPressTestNotificationAsync}
              />

              <LucideIconTextEffectButton
                selectedBackgroundColor={Color_Text}

                selectedColorOfTextAndIcon={Color_BG}
                unselectedColorOfTextAndIcon={Color_Text}

                notChangeToSelected
                manuallySelected={true}
                canHandlePressWhenSelected

                style={style.normalBtn}

                title={texts.set_notification}
                titleProps={{ style: style.normalBtnTxt }}

                onPress={onPressSetNotification}
              />
            </View>

            {
              alreadySetInfoTxt &&
              <Text onPress={onPressStatusInfo} numberOfLines={1} adjustsFontSizeToFit style={style.alreadySetInfoTxt}>{alreadySetInfoTxt}</Text>
            }
          </>
        }

        {
          subView === 'history' &&
          <HistoryScreen
            setHandling={set_handlingType}
          />
        }

        {
          subView === 'about' &&
          <About
          />
        }

        {/* popup */}
        {
          contentToRenderInPopup &&
          <SlidingPopup
            backgroundColor={Color_Text}
            blurBackgroundColorInHex={Color_BG}
            handleColor={Color_BG}
            child={contentToRenderInPopup()}
            onFinishedHide={() => set_showPopup(undefined)}
            childMaxHeight={'70%'}
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

        {/* handling */}
        {
          handlingType &&
          <View style={style.downloadingView}>
            {/* indicator */}
            {
              handlingType !== 'done' &&
              <ActivityIndicator color={Color_Text} />
            }

            {/* handling text */}
            {
              handlingType !== 'done' && handlingType !== 'setting_notification' &&
              <Text style={style.downloadingTxt}>{handlingType === 'downloading' ?
                texts.downloading_data :
                texts.loading_data
              }...</Text>
            }

            {/* set noti text */}
            {
              handlingType === 'setting_notification' &&
              <>
                <Text style={style.downloadingTxt}>{texts.setting_notification}...</Text>
                {
                  processPercent !== '' &&
                  <Text style={style.downloadingTxt}>{processPercent}</Text>
                }
              </>
            }

            {/* done state */}
            {
              handlingType === 'done' &&
              <View style={style.doneView}>
                <View style={style.doneTimeView}>
                  {/* icon done */}
                  <LucideIcon name='Check' size={FontSize.Normal} color={Color_Text} />

                  {/* done text */}
                  <Text style={style.downloadingTxt}>{texts.done}!</Text>

                  {/* list time text */}
                  <Text style={SettingItemPanelStyle.doneTxt}>{pushTimeListText}</Text>

                  {/* back btn */}
                  <LucideIconTextEffectButton
                    unselectedColorOfTextAndIcon={Color_Text}

                    notChangeToSelected
                    manuallySelected={false}
                    canHandlePressWhenSelected

                    style={style.handlingBackBtn}

                    title={'Okay'}
                    titleProps={{ style: style.normalBtnTxt }}

                    onPress={() => set_handlingType(undefined)}
                  />
                </View>

                {/* hair line */}
                <HairLine
                  color={Color_Text2}
                  widthPercent={StartupWindowSize.width - (Outline.Normal * 2)}
                />

                {/* note device */}
                <Text style={SettingItemPanelStyle.doneTxt}>{texts.push_notice_device}</Text>
              </View>
            }
          </View>
        }
      </View>
    </AppContext.Provider>
  )
}

export default SetupScreen