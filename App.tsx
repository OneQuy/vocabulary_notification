import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import SetupScreen from './src/App/Screens/SetupScreen'
import { Color_BG } from './src/App/Hooks/useTheme'
import useAsyncHandle from './src/Common/Hooks/useAsyncHandle'
import { SplashScreenLoader } from './src/Common/SplashScreenLoader'
import SplashScreen from './src/Common/Components/SplashScreen'

const App = () => {
  const { handled, result } = useAsyncHandle(async () => SplashScreenLoader());

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, backgroundColor: Color_BG }
    })
  }, [])

  useEffect(() => {
    // (async () => {
    // })()
  }, [])

  if (true)
    return <SplashScreen />

  return (
    <SafeAreaView style={style.master}>
      <StatusBar backgroundColor={Color_BG} barStyle={'light-content'} />
      <View style={style.master}>
        <SetupScreen />
      </View>
    </SafeAreaView>
  )
}

export default App