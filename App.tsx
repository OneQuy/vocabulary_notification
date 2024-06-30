import { SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SetupScreen from './src/App/Screens/SetupScreen'
import { Color_BG } from './src/App/Hooks/useTheme'
import useAsyncHandle from './src/Common/Hooks/useAsyncHandle'
import { SplashScreenLoader } from './src/Common/SplashScreenLoader'
import SplashScreen from './src/Common/Components/SplashScreen'
import { PostHogProvider } from 'posthog-react-native'
import { PostHogKey_Production } from './Keys'
import { GetAlternativeConfig } from './src/Common/RemoteConfig'
import WelcomeScreen from './src/App/Screens/WelcomeScreen'
import { GetBooleanAsync, SetBooleanAsync } from './src/Common/AsyncStorageUtils'
import { StorageKey_ShowedWelcomeScreen } from './src/App/Constants/StorageKey'
import Paywall from './src/App/Screens/Paywall'

const App = () => {
  const { handled } = useAsyncHandle(async () => SplashScreenLoader());
  const [showWelcomeScreen, set_showWelcomeScreen] = useState(false)
  const [showPaywall, set_showPaywall] = useState(false)

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, backgroundColor: Color_BG }
    })
  }, [])

  const onPressLaterPaywall = useCallback(() => {
    set_showPaywall(false)
  }, [])

  const onPressStartWelcomeScreen = useCallback(() => {
    SetBooleanAsync(StorageKey_ShowedWelcomeScreen, true)
    set_showWelcomeScreen(false)
  }, [])

  // check welcome screen

  useEffect(() => {
    (async () => {
      const showed = await GetBooleanAsync(StorageKey_ShowedWelcomeScreen)

      if (!showed) {
        set_showWelcomeScreen(true)
        set_showPaywall(true)
      }
    })()
  }, [])

  // splash screen

  if (!handled)
    return <SplashScreen />

  // welcome screen

  if (showWelcomeScreen) {
    return (
      <SafeAreaView style={style.master}>
        <StatusBar backgroundColor={Color_BG} barStyle={'light-content'} />
        <WelcomeScreen onPressStart={onPressStartWelcomeScreen} />
      </SafeAreaView>
    )
  }

  // paywall

  if (showPaywall) {
    return (
      <SafeAreaView style={style.master}>
        <StatusBar backgroundColor={Color_BG} barStyle={'light-content'} />
        <Paywall onPressCancel={onPressLaterPaywall} />
      </SafeAreaView>
    )
  }

  // main app render

  const postHogAutocapture = GetAlternativeConfig('postHogAutoCapture', false)

  return (
    <PostHogProvider apiKey={PostHogKey_Production} autocapture={postHogAutocapture}>
      <SafeAreaView style={style.master}>
        <StatusBar backgroundColor={Color_BG} barStyle={'light-content'} />
        <SetupScreen />
      </SafeAreaView>
    </PostHogProvider>
  )
}

export default App