import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import React, { useMemo } from 'react'
import SetupScreen from './src/App/Screens/SetupScreen'
import useTheme from './src/App/Hooks/useTheme'

const App = () => {
  const theme = useTheme()

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, backgroundColor: theme.background }
    })
  }, [theme])

  return (
    <SafeAreaView style={style.master}>
      <StatusBar backgroundColor={theme.background} barStyle={theme.isDarkTheme ? 'light-content' : 'dark-content'}/>
      <View style={style.master}>
        <SetupScreen />
      </View>
    </SafeAreaView>
  )
}

export default App