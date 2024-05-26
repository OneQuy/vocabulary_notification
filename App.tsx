import { SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import React, { useMemo } from 'react'
import SetupScreen from './src/App/Screens/SetupScreen'
import { Color_BG } from './src/App/Hooks/useTheme'
import useAsyncHandle from './src/Common/Hooks/useAsyncHandle'
import { SplashScreenLoader } from './src/Common/SplashScreenLoader'
import SplashScreen from './src/Common/Components/SplashScreen'
import { PostHogProvider } from 'posthog-react-native'
import { PostHogKey_Production } from './Keys'

const App = () => {
  const { handled } = useAsyncHandle(async () => SplashScreenLoader());

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, backgroundColor: Color_BG }
    })
  }, [])

  if (!handled)
    return <SplashScreen />

  return (
    <PostHogProvider apiKey={PostHogKey_Production}>
      <SafeAreaView style={style.master}>
        <StatusBar backgroundColor={Color_BG} barStyle={'light-content'} />
        <SetupScreen />
      </SafeAreaView>
    </PostHogProvider>
  )
}

export default App