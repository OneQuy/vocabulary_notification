import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { AddS, AlertAsync, ArrayRemove, CloneObject, GetDayHourMinSecFromMs, GetDayHourMinSecFromMs_ToString, PrependZero, ToCanPrint } from '../../Common/UtilsTS'
import HairLine from '../../Common/Components/HairLine'
import { CommonStyles, WindowSize_Max } from '../../Common/CommonConstants'
import SlidingPopup from '../../Common/Components/SlidingPopup'
import { DefaultExcludedTimePairs, DefaultIntervalInMin, DefaultNumDaysToPush, IntervalInMinPresets, LimitWordsPerDayPresets, NumDaysToPushPresets, PopuplarityLevelNumber } from '../Constants/AppConstants'
import TimePicker, { TimePickerResult } from '../Components/TimePicker'
import { LucideIcon } from '../../Common/Components/LucideIcon'
import { GetLanguage, Language, Languages } from '../../Common/DeepTranslateApi'
import { PairTime } from '../Types'
import { AlertError, TotalMin } from '../Handles/AppUtils'
import { SetNotificationAsync, TestNotificationAsync } from '../Handles/SetupNotification'
import { GetExcludeTimesAsync as GetExcludedTimesAsync, GetIntervalMinAsync, GetLimitWordsPerDayAsync, GetNumDaysToPushAsync, GetPopularityLevelIndexAsync, GetTargetLangAsync, SetExcludedTimesAsync, SetIntervalMinAsync, SetLimitWordsPerDayAsync, SetNumDaysToPushAsync, SetPopularityLevelIndexAsync, SettTargetLangAsyncAsync } from '../Handles/Settings'
import { DownloadWordDataAsync, GetAllWordsDataCurrentLevelAsync } from '../Handles/WordsData'
import { GetBooleanAsync, SetBooleanAsync } from '../../Common/AsyncStorageUtils'
import { StorageKey_ShowDefinitions, StorageKey_ShowExample, StorageKey_ShowPartOfSpeech, StorageKey_ShowPhonetic, StorageKey_ShowRankOfWord } from '../Constants/StorageKey'

const HistoryScreen = () => {
  const theme = useTheme()

  const texts = useLocalText()

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, },
      scrollView: { gap: Gap.Small, padding: Outline.Normal, },
    })
  }, [theme])

  // render

  return (
    <View style={style.master}>

    </View>
  )
}

export default HistoryScreen