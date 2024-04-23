import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { CommonStyles } from '../../Common/CommonConstants'
import { FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'

const SetupScreen = () => {
  const theme = useTheme()

  const style = useMemo(() => {
    return StyleSheet.create({
      title: { fontSize: FontSize.Normal, color: theme.primary}
    })
  }, [theme])

  return (
    <View style={CommonStyles.flex_1}>
      <Text style={style.title}>SetupScreen</Text>
    </View>
  )
}

export default SetupScreen