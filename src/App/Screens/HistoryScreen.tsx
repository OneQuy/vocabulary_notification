import { View, StyleSheet } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { UpdatePushedWordsAndRefreshCurrentNotiWordsAsync } from '../Handles/SetupNotification'

const HistoryScreen = () => {
  const theme = useTheme()

  const texts = useLocalText()

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, },
      flatlistView: { gap: Gap.Small, padding: Outline.Normal, },
    })
  }, [theme])

  useEffect(() => {
    (async () => {
      // update pushed word to db

      await UpdatePushedWordsAndRefreshCurrentNotiWordsAsync()

    })()
  }, [])

  // render

  return (
    <View style={style.master}>

    </View>
  )
}

export default HistoryScreen