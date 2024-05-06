import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { UpdatePushedWordsAndRefreshCurrentNotiWordsAsync } from '../Handles/SetupNotification'
import { GetLocalizedWordFromDbAsync } from '../Handles/LocalizedWordsTable'
import { SavedWordData } from '../Types'
import { GetElementsOfPageArray, SafeArrayLength } from '../../Common/UtilsTS'
import { FontSize } from '../Constants/Constants_FontSize'
import { HandlingType } from './SetupScreen'
import { CheckDeserializeLocalizedData, ExtractWordFromWordLang } from '../Handles/AppUtils'

const PageItemCount = 10

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

      historyEmptyTxt: { alignSelf: 'center', marginTop: '70%', fontSize: FontSize.Normal, color: theme.counterBackground },

      historyItemTxt_Title: { fontSize: FontSize.Normal, color: theme.primary },
      historyItemTxt_Content: { fontSize: FontSize.Normal, color: theme.counterBackground },
    })
  }, [theme])

  const currentPageItemData = useMemo(() => {
    if (SafeArrayLength(allPushedWordsOrError) <= 0 || allPushedWordsOrError instanceof Error)
      return undefined

    return GetElementsOfPageArray(allPushedWordsOrError, curPageIdx, PageItemCount)
  }, [allPushedWordsOrError, curPageIdx])

  // callbacks

  const renderItem = useCallback(({ item, index }: { item: SavedWordData, index: number }) => {
    return (
      <TouchableOpacity key={item.wordAndLang}>
        <Text style={style.historyItemTxt_Title}>{item.wordAndLang}</Text>
        {
          typeof item.localizedData === 'object' &&
          <Text style={style.historyItemTxt_Content}>{item.localizedData.translated}</Text>
        }
      </TouchableOpacity>
    )
  }, [style])

  // console.log(SafeArrayLength(allPushedWordsOrError));

  useEffect(() => {
    (async () => {
      setHandling('loading_local')

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
        return a.lastNotiTick - b.lastNotiTick
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
      <FlatList
        contentContainerStyle={style.flatlistView}
        data={currentPageItemData.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.wordAndLang}
      />
    </View>
  )
}

export default HistoryScreen