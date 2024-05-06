import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { UpdatePushedWordsAndRefreshCurrentNotiWordsAsync } from '../Handles/SetupNotification'
import { GetLocalizedWordFromDbAsync } from '../Handles/LocalizedWordsTable'
import { SavedWordData } from '../Types'
import { DelayAsync, GetElementsOfPageArray, HexToRgb, SafeArrayLength } from '../../Common/UtilsTS'
import { FontSize } from '../Constants/Constants_FontSize'
import { HandlingType } from './SetupScreen'
import { CheckDeserializeLocalizedData, ExtractWordFromWordLang } from '../Handles/AppUtils'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'

const PageItemCount = 20

const HistoryScreen = ({
  setHandling
}: {
  setHandling: (type: HandlingType) => void
}) => {
  const theme = useTheme()
  const texts = useLocalText()

  const [allPushedWordsOrError, set_allPushedWordsOrError] = useState<Error | SavedWordData[]>([])
  const [curPageIdx, set_curPageIdx] = useState(0)

  // memos

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, paddingTop: Outline.Normal },

      flatlistView: { gap: Gap.Normal, padding: Outline.Normal, },
      itemMainLineView: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

      historyEmptyTxt: { alignSelf: 'center', marginTop: '70%', fontSize: FontSize.Normal, color: theme.counterBackground },

      historyItemTxt_Title: { fontSize: FontSize.Normal, color: theme.primary },
      historyItemTxt_Content: { fontSize: FontSize.Normal, color: theme.counterBackground },
      historyItemTxt_Tick: { fontSize: FontSize.Small, color: HexToRgb(theme.counterBackground, 0.3) },

      navigationBarView: { flexDirection: 'row', },
      pageNumView: { flexDirection: 'row', },
      pageNumTxt: { fontSize: FontSize.Normal, color: theme.counterBackground, alignSelf: 'center' },
      navigationBtn: { flex: 1, padding: Outline.Normal, },
    })
  }, [theme])

  const currentPageItemData = useMemo(() => {
    if (SafeArrayLength(allPushedWordsOrError) <= 0 || allPushedWordsOrError instanceof Error)
      return undefined

    return GetElementsOfPageArray(allPushedWordsOrError, curPageIdx, PageItemCount)
  }, [allPushedWordsOrError, curPageIdx])

  // callbacks

  const onPressNextPage = useCallback((next: boolean) => {
    if (!currentPageItemData)
      return

    set_curPageIdx(currentPageItemData.pageIdx + (next ? 1 : -1))
  }, [currentPageItemData])

  const renderItem = useCallback(({ item, index }: { item: SavedWordData, index: number }) => {
    return (
      <TouchableOpacity key={item.wordAndLang}>
        {/* tick */}
        <Text style={style.historyItemTxt_Tick}>{new Date(item.lastNotiTick).toLocaleString()}</Text>

        {/* main line */}
        <View style={style.itemMainLineView}>
          {/* word */}
          <Text style={style.historyItemTxt_Title}>{ExtractWordFromWordLang(item.wordAndLang)}</Text>

          {/* mean */}
          {
            typeof item.localizedData === 'object' &&
            <Text style={style.historyItemTxt_Content}>{item.localizedData.translated}</Text>
          }
        </View>
      </TouchableOpacity>
    )
  }, [style])

  // console.log(SafeArrayLength(allPushedWordsOrError));

  useEffect(() => {
    (async () => {
      await DelayAsync(200)
      
      setHandling('loading_local')
      
      await DelayAsync(200)

      // update pushed word to db

      await UpdatePushedWordsAndRefreshCurrentNotiWordsAsync()

      // words 

      const allPushed = await GetLocalizedWordFromDbAsync(undefined, true)

      if (allPushed instanceof Error) {
        set_allPushedWordsOrError(allPushed)
        return
      }

      for (let i = 0; i < allPushed.length; i++) {
        const word = allPushed[i]

        CheckDeserializeLocalizedData(word)
      }

      allPushed.sort((a, b) => {
        return b.lastNotiTick - a.lastNotiTick
      })

      set_allPushedWordsOrError(allPushed)

      setHandling(undefined)
    })()
  }, [])

  // render

  if (!Array.isArray(currentPageItemData?.items)) {
    return <Text style={style.historyEmptyTxt}>{texts.history_empty}</Text>
  }

  return (
    <View style={style.master}>
      {/* list */}
      <FlatList
        contentContainerStyle={style.flatlistView}
        data={currentPageItemData.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.wordAndLang}
      />

      {/* bottom buttons */}
      <View style={style.navigationBarView}>
        {/* go previous page btn */}
        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}

          style={style.navigationBtn}

          iconProps={{ name: 'ChevronLeft', size: FontSize.Normal, }}

          notChangeToSelected
          onPress={() => onPressNextPage(false)}
        />

        {/* page num */}
        <View style={style.pageNumView}>
          <Text style={style.pageNumTxt}>{`${currentPageItemData?.pageIdx + 1}/${currentPageItemData?.totalPageCount}`}</Text>
        </View>

        {/* go next page btn */}
        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}

          style={style.navigationBtn}

          iconProps={{ name: 'ChevronRight', size: FontSize.Normal, }}

          notChangeToSelected
          onPress={() => onPressNextPage(true)}
        />
      </View>
    </View>
  )
}

export default HistoryScreen