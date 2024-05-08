import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { AddS, AlertAsync, ArrayRemove, CloneObject, GetDayHourMinSecFromMs, GetDayHourMinSecFromMs_ToString, LogStringify, PrependZero, ToCanPrint } from '../../Common/UtilsTS'
import HairLine from '../../Common/Components/HairLine'
import { CommonStyles, WindowSize_Max } from '../../Common/CommonConstants'
import SlidingPopup from '../../Common/Components/SlidingPopup'
import { DefaultExcludedTimePairs, DefaultIntervalInMin, DefaultNumDaysToPush, IntervalInMinPresets, LimitWordsPerDayPresets, NumDaysToPushPresets, PopuplarityLevelNumber, TranslationServicePresets } from '../Constants/AppConstants'
import TimePicker, { TimePickerResult } from '../Components/TimePicker'
import { LucideIcon } from '../../Common/Components/LucideIcon'
import { PairTime, TranslationService } from '../Types'
import { TotalMin } from '../Handles/AppUtils'
import { SetNotificationAsync, TestNotificationAsync } from '../Handles/SetupNotification'
import { GetDefaultTranslationService, GetExcludeTimesAsync as GetExcludedTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetNumDaysToPushAsync, GetPopularityLevelIndexAsync, GetTargetLangAsync, GetTranslationServiceAsync, SetExcludedTimesAsync, SetIntervalMinAsync, SetLimitWordsPerDayAsync, SetNumDaysToPushAsync, SetPopularityLevelIndexAsync, SetTranslationServiceAsync, SetTargetLangAsyncAsync } from '../Handles/Settings'
import { DownloadWordDataAsync, GetAllWordsDataCurrentLevelAsync } from '../Handles/WordsData'
import { GetBooleanAsync, SetBooleanAsync } from '../../Common/AsyncStorageUtils'
import { StorageKey_ShowDefinitions, StorageKey_ShowExample, StorageKey_ShowPartOfSpeech, StorageKey_ShowPhonetic, StorageKey_ShowRankOfWord } from '../Constants/StorageKey'
import HistoryScreen from './HistoryScreen'
import { HandleError } from '../../Common/Tracking'
import { GetLanguageFromCode, Language } from '../../Common/TranslationApis/TranslationLanguages'
import { DevistyTranslateAsync } from '../../Common/TranslationApis/DevistyTranslateApi'
import { DevistyTranslateApiKey } from '../../../Keys'
import { GetCurrentTranslationServiceSuitAsync } from '../Handles/TranslateBridge'

type SubView =
  'setup' |
  'history' |
  'about'

type PopupType =
  'popularity' |
  'interval' |
  'limit-word' |
  'target-lang' |
  'num_days_push' |
  'translation_service' |
  undefined

export type HandlingType =
  'downloading' |
  'loading_local' |
  'setting_notification' |
  'done' |
  undefined

const SetupScreen = () => {
  const theme = useTheme()
  const texts = useLocalText()

  const [handlingType, set_handlingType] = useState<HandlingType>(undefined)
  const [subView, set_subView] = useState<SubView>('setup')
  const [showPopup, set_showPopup] = useState<PopupType>(undefined)
  const popupCloseCallbackRef = useRef<(onFinished?: () => void) => void>()

  const [displayPopularityLevelIdx, set_displayPopularityLevelIdx] = useState(0)
  const [displayIntervalInMin, set_displayIntervalInMin] = useState<number>(DefaultIntervalInMin)
  const [displayWordLimitNumber, set_displayWordLimitNumber] = useState<number>(5)
  const [displayNumDaysToPush, set_displayNumDaysToPush] = useState<number>(DefaultNumDaysToPush)

  const [supportedLanguages, set_supportedLanguages] = useState<Language[]>([])
  const [displayTargetLang, set_displayTargetLang] = useState<Language | undefined>()
  const [searchLangInputTxt, set_searchLangInputTxt] = useState('')

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
      master: { flex: 1, paddingBottom: Outline.Normal },
      scrollView: { gap: Gap.Small, padding: Outline.Normal, },

      topbarView: { flexDirection: 'row' },
      topbarBtn: { flexDirection: 'row', padding: Outline.Small, gap: Gap.Small, flex: 1 },

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

      downloadingView: { gap: Gap.Normal, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute', backgroundColor: theme.background },
      downloadingTxt: { fontSize: FontSize.Normal, fontWeight: FontBold.Bold, color: theme.primary },

      normalBtn: {
        borderWidth: WindowSize_Max * 0.0015,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
      },

      displaySettingBtn: {
        // borderWidth: WindowSize_Max * 0.0015,
        // borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
        justifyContent: 'flex-start',
      },

      handlingBackBtn: {
        borderWidth: WindowSize_Max * 0.0015,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
        marginTop: '10%',
        width: '50%',
      },

      moreSettingBtn: {
        flexDirection: 'row',
        gap: Gap.Normal,
      },

      normalBtn_NoBorder: {
        padding: Outline.Normal,
      },

      bottomButtonsView: {
        flexDirection: 'row',
        gap: Gap.Normal,
        justifyContent: 'center',
        alignItems: 'center',
      },
    })
  }, [theme])

  const onPressSubview = useCallback((type: SubView) => {
    set_subView(type)
  }, [])

  const onPressMoreSetting = useCallback(() => {
    set_showMoreSetting(v => !v)
  }, [])

  /**
   * 
   * @returns ensuring data got cached
   */
  const setHandlingAndGetReadyDataAsync = async (popularityLevelIdx = -1): Promise<boolean> => {
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

        if (dlRes instanceof Error) { // dl fail
          const isPressRight = await AlertAsync(
            texts.popup_error,
            `${texts.fail_download}\n\n${dlRes}`,
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

  const onPressTestNotificationAsync = useCallback(async () => {
    const dataReady = await setHandlingAndGetReadyDataAsync()

    if (!dataReady)
      return

    const res = await TestNotificationAsync(set_handlingType)

    if (res instanceof Error) {
      HandleError(res, 'onPressTestNotificationAsync', true)
    }
  }, [setHandlingAndGetReadyDataAsync])

  const onPressSetNotification = useCallback(async () => {
    set_handlingType('setting_notification')

    const res = await SetNotificationAsync()

    if (res === undefined) { // success
      set_handlingType('done')
    }
    else { // error
      let s = res.errorText ? texts[res.errorText] : ''

      if (res.error) {
        if (s !== '')
          s += '\n\n'

        s += ToCanPrint(res.error)
      }

      HandleError(s, 'onPressSetNotification')

      set_handlingType(undefined)
    }

  }, [texts])

  const onConfirmTimePicker = useCallback((time: TimePickerResult) => {
    if (editingExcludeTimePairAndElementIndex.current[0] === undefined ||
      editingExcludeTimePairAndElementIndex.current[1] === -1
    ) { // set for interval
      const min = time.hours * 60 + time.minutes
      set_displayIntervalInMin(min)
      SetIntervalMinAsync(min)
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

      const obj = CloneObject(displayExcludedTimePairs)

      set_displayExcludedTimePairs(obj)

      SetExcludedTimesAsync(obj)
    }
  }, [displayExcludedTimePairs, texts])

  // noti display

  const onPressDisplaySetting = useCallback((storageKey: string, setter: typeof set_displaySettting_ShowPhonetic) => {
    setter(val => {
      const toValue = !val

      SetBooleanAsync(storageKey, toValue)

      return toValue
    })
  }, [texts])

  const renderDisplaySettingItem = useCallback((
    title: string,
    getter: typeof displaySettting_ShowPhonetic,
    setter: typeof set_displaySettting_ShowPhonetic,
    storeKey: string,
  ) => {
    return (
      <LucideIconTextEffectButton
        unselectedColorOfTextAndIcon={theme.counterBackground}
        notChangeToSelected
        style={style.displaySettingBtn}

        title={title}
        titleProps={{ style: style.normalBtnTxt }}

        iconProps={{ name: getter ? 'CheckSquare' : 'Square', size: FontSize.Normal, }}

        onPress={() => onPressDisplaySetting(storeKey, setter)}
      />
    )
  }, [style, theme])

  // popularity

  const onPressPopularityLevel = useCallback((popularityLevelIdx: number) => {
    if (!popupCloseCallbackRef.current)
      return

    popupCloseCallbackRef.current(async () => { // on closed
      const dataReady = await setHandlingAndGetReadyDataAsync(popularityLevelIdx)

      if (!dataReady)
        return

      // data ok!

      set_displayPopularityLevelIdx(popularityLevelIdx)
      SetPopularityLevelIndexAsync(popularityLevelIdx)
    })
  }, [setHandlingAndGetReadyDataAsync])

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

  // interval (repeat)

  const onPressInterval = useCallback((minutesOrCustom: number | undefined) => {
    if (minutesOrCustom !== undefined)
      set_displayIntervalInMin(minutesOrCustom)

    if (popupCloseCallbackRef.current)
      popupCloseCallbackRef.current(() => {
        if (minutesOrCustom === undefined) // custom
          set_showTimePicker(true)
        else
          SetIntervalMinAsync(minutesOrCustom)
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

  // translate service

  const onChangedTranslationService = useCallback(async (service: TranslationService) => {
    set_displayTranslationService(service)

    SetTranslationServiceAsync(service)

    const suit = await GetCurrentTranslationServiceSuitAsync()

    set_supportedLanguages(suit.supportedLanguages)
  }, [])

  const onPressTranslationService = useCallback((service: TranslationService) => {
    if (!popupCloseCallbackRef.current)
      return

    popupCloseCallbackRef.current(() => { // closed
      onChangedTranslationService(service)
    })
  }, [onChangedTranslationService])

  const renderPickTranslationService = useCallback(() => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollViewSlidingPopup}
      >
        {
          TranslationServicePresets.map((service: TranslationService) => {
            const isSelected = service === displayTranslationService

            return (
              <LucideIconTextEffectButton
                key={service}

                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                onPress={() => onPressTranslationService(service)}

                manuallySelected={isSelected}
                notChangeToSelected
                canHandlePressWhenSelected

                style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                title={service}

                titleProps={{ style: style.normalBtnTxt }}
              />
            )
          })
        }
      </ScrollView>
    )
  }, [displayTranslationService, theme, style])

  // num days to push

  const onPressNumDaysToPush = useCallback((numDays: number) => {
    if (popupCloseCallbackRef.current) {
      popupCloseCallbackRef.current(() => {
        set_displayNumDaysToPush(numDays)
        SetNumDaysToPushAsync(numDays)
      })
    }
  }, [])

  const renderNumDaysToPush = useCallback(() => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollViewSlidingPopup}
      >
        {
          NumDaysToPushPresets.map((dayNum: number) => {
            const isSelected = dayNum === displayNumDaysToPush

            return (
              <LucideIconTextEffectButton
                key={dayNum}

                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                onPress={() => onPressNumDaysToPush(dayNum)}

                manuallySelected={isSelected}
                notChangeToSelected
                canHandlePressWhenSelected

                style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                title={dayNum + ' ' + AddS(texts.day, dayNum)}

                titleProps={{ style: style.normalBtnTxt }}
              />
            )
          })
        }
      </ScrollView>
    )
  }, [displayNumDaysToPush, theme, style])

  // target lang

  const onPressTargetLang = useCallback((lang: Language) => {
    set_displayTargetLang(lang)

    if (popupCloseCallbackRef.current) {
      popupCloseCallbackRef.current(() => {
        SetTargetLangAsyncAsync(lang.language)
      })
    }
  }, [])

  const renderPickTargetLang = useCallback(() => {
    const langs = supportedLanguages.filter(lang => searchLangInputTxt.length === 0 || lang.name.toLowerCase().includes(searchLangInputTxt.toLowerCase()))

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
  }, [displayTargetLang, supportedLanguages, searchLangInputTxt, texts, theme, style])

  // exclude time

  const onPressAddExcludeTime = useCallback(() => {
    displayExcludedTimePairs.push(DefaultExcludedTimePairs[0])

    const obj = CloneObject(displayExcludedTimePairs)

    set_displayExcludedTimePairs(obj)

    SetExcludedTimesAsync(obj)
  }, [displayExcludedTimePairs])

  const onPressRemoveExcludeTime = useCallback((pair: PairTime) => {
    ArrayRemove(displayExcludedTimePairs, pair)

    const obj = CloneObject(displayExcludedTimePairs)

    set_displayExcludedTimePairs(obj)

    SetExcludedTimesAsync(obj)
  }, [displayExcludedTimePairs])

  const renderExcludeTimes = useCallback(() => {
    return (
      displayExcludedTimePairs.map((pair: PairTime, index: number) => {
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
  }, [displayExcludedTimePairs, theme, style])

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
  else if (showPopup === 'translation_service')
    contentToRenderInPopup = renderPickTranslationService
  else if (showPopup === 'num_days_push')
    contentToRenderInPopup = renderNumDaysToPush
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

  // load setting

  useEffect(() => {
    (async () => {
      const levelPopularity = await GetPopularityLevelIndexAsync()
      set_displayPopularityLevelIdx(levelPopularity)

      const intervalInMin = await GetIntervalMinAsync()
      set_displayIntervalInMin(intervalInMin)

      const limitWordsPerDay = await GetLimitWordsPerDayAsync()
      set_displayWordLimitNumber(limitWordsPerDay)

      const numDaysToPush = await GetNumDaysToPushAsync()
      set_displayNumDaysToPush(numDaysToPush)

      const excludedTimePairs = await GetExcludedTimesAsync()
      set_displayExcludedTimePairs(excludedTimePairs)

      const targetLang = await GetTargetLangAsync()
      set_displayTargetLang(targetLang ? GetLanguageFromCode(targetLang) : undefined)

      const service = await GetTranslationServiceAsync()
      onChangedTranslationService(service)

      // setting display notifition

      set_displaySettting_ShowPhonetic(await GetBooleanAsync(StorageKey_ShowPhonetic))
      set_displaySettting_RankOfWord(await GetBooleanAsync(StorageKey_ShowRankOfWord))
      set_displaySettting_Definitions(await GetBooleanAsync(StorageKey_ShowDefinitions))
      set_displaySettting_Example(await GetBooleanAsync(StorageKey_ShowExample))
      set_displaySettting_ShowPartOfSpeech(await GetBooleanAsync(StorageKey_ShowPartOfSpeech))
    })()
  }, [])

  // render

  return (
    <View style={style.master}>
      {/* topbar */}
      <View style={style.topbarView}>
        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          selectedColorOfTextAndIcon={theme.counterPrimary}
          selectedBackgroundColor={theme.primary}

          style={style.topbarBtn}

          title={texts.setup}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Rocket', size: FontSize.Normal, }}

          effectType='scale'
          effectDelay={50}

          manuallySelected={subView === 'setup'}
          onPress={() => onPressSubview('setup')}
        />
        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          selectedColorOfTextAndIcon={theme.counterPrimary}
          selectedBackgroundColor={theme.primary}

          style={style.topbarBtn}

          title={texts.history}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'History', size: FontSize.Normal, }}

          effectType='scale'
          effectDelay={50}

          manuallySelected={subView === 'history'}
          onPress={() => onPressSubview('history')}
        />
        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          selectedColorOfTextAndIcon={theme.counterPrimary}
          selectedBackgroundColor={theme.primary}

          style={style.topbarBtn}

          title={texts.about}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Info', size: FontSize.Normal, }}

          effectType='scale'

          manuallySelected={subView === 'about'}
          onPress={() => onPressSubview('about')}
        />
      </View>

      {
        subView === 'setup' &&
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

          {/* more setting */}

          <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

          <LucideIconTextEffectButton
            unselectedColorOfTextAndIcon={theme.counterBackground}
            notChangeToSelected
            style={style.moreSettingBtn}

            title={texts.more_setting}

            titleProps={{ style: style.normalBtnTxt }}

            iconProps={{ name: showMoreSetting ? 'ChevronUp' : 'ChevronDown', size: FontSize.Normal, }}

            onPress={onPressMoreSetting}
          />

          {/* limit words */}

          {
            showMoreSetting &&
            <>
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
            </>
          }

          {/* translate service */}

          {
            showMoreSetting &&
            <>
              <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

              <Text style={style.header}>{texts.translation_service}</Text>

              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={theme.counterBackground}
                notChangeToSelected
                style={style.normalBtn}

                title={displayTranslationService}
                titleProps={{ style: style.normalBtnTxt }}

                iconProps={{ name: 'Sliders', size: FontSize.Normal, }}

                onPress={() => onPressShowPopup('translation_service')}
              />
            </>
          }

          {/* num days to push */}

          {
            showMoreSetting &&
            <>
              <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

              <Text style={style.header}>{texts.num_days_to_push}</Text>

              <LucideIconTextEffectButton
                unselectedColorOfTextAndIcon={theme.counterBackground}
                notChangeToSelected
                style={style.normalBtn}

                title={displayNumDaysToPush + ' ' + AddS(texts.day, displayNumDaysToPush)}
                titleProps={{ style: style.normalBtnTxt }}

                iconProps={{ name: 'CalendarDays', size: FontSize.Normal, }}

                onPress={() => onPressShowPopup('num_days_push')}
              />
            </>
          }

          {/* display of noti */}

          {
            showMoreSetting &&
            <>
              <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />
              <Text style={style.header}>{texts.noti_display}</Text>
            </>
          }

          {/* display of noti - phonetic */}

          {
            showMoreSetting &&
            renderDisplaySettingItem(
              texts.show_phonetic,
              displaySettting_ShowPhonetic,
              set_displaySettting_ShowPhonetic,
              StorageKey_ShowPhonetic
            )
          }

          {/* display of noti - part of speech */}

          {
            showMoreSetting &&
            renderDisplaySettingItem(
              texts.show_part_of_speech,
              displaySettting_ShowPartOfSpeech,
              set_displaySettting_ShowPartOfSpeech,
              StorageKey_ShowPartOfSpeech
            )
          }

          {/* display of noti - example */}

          {
            showMoreSetting &&
            renderDisplaySettingItem(
              texts.show_examble,
              displaySettting_Example,
              set_displaySettting_Example,
              StorageKey_ShowExample
            )
          }

          {/* display of noti - definitions */}

          {
            showMoreSetting &&
            renderDisplaySettingItem(
              texts.show_definitions,
              displaySettting_Definitions,
              set_displaySettting_Definitions,
              StorageKey_ShowDefinitions
            )
          }

          {/* display of noti - rank */}

          {
            showMoreSetting &&
            renderDisplaySettingItem(
              texts.show_rank_of_word,
              displaySettting_RankOfWord,
              set_displaySettting_RankOfWord,
              StorageKey_ShowRankOfWord
            )
          }
        </ScrollView>
      }

      {/* set notification & test btn */}

      {
        subView === 'setup' &&
        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />
      }

      {
        subView === 'setup' &&
        <View style={style.bottomButtonsView}>
          <LucideIconTextEffectButton
            unselectedColorOfTextAndIcon={theme.counterBackground}
            notChangeToSelected
            style={style.normalBtn}

            title={texts.test_notification}
            titleProps={{ style: style.normalBtnTxt }}

            iconProps={{ name: 'Bell', size: FontSize.Normal, }}

            onPress={onPressTestNotificationAsync}
          />

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
        </View>
      }

      {
        subView === 'history' &&
        <HistoryScreen
          setHandling={set_handlingType}
        />
      }

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

      {/* handling */}
      {
        handlingType &&
        <View style={style.downloadingView}>
          {/* indicator */}
          {
            handlingType !== 'done' &&
            <ActivityIndicator color={theme.counterBackground} />
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
            <Text style={style.downloadingTxt}>{texts.setting_notification}...</Text>
          }

          {/* icon done */}
          {
            handlingType === 'done' &&
            <LucideIcon name='Check' size={FontSize.Normal} color={theme.counterBackground} />
          }

          {/* done text */}
          {
            handlingType === 'done' &&
            <Text style={style.downloadingTxt}>{texts.done}!</Text>
          }

          {/* back btn */}
          {
            handlingType === 'done' &&
            <LucideIconTextEffectButton
              unselectedColorOfTextAndIcon={theme.counterBackground}

              notChangeToSelected
              manuallySelected={false}
              canHandlePressWhenSelected

              style={style.handlingBackBtn}

              title={texts.back}
              titleProps={{ style: style.normalBtnTxt }}

              iconProps={{ name: 'ChevronLeft', size: FontSize.Normal, }}

              onPress={() => set_handlingType(undefined)}
            />
          }
        </View>
      }
    </View>
  )
}

export default SetupScreen