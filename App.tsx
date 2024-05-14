import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import SetupScreen from './src/App/Screens/SetupScreen'
import { Color_BG } from './src/App/Hooks/useTheme'
import { initNotificationAsync } from './src/Common/Nofitication'
import { InitIAPAsync } from './src/Common/IAP/IAP'
import { AllIAPProducts } from './src/App/Hooks/usePremium'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageKey_CachedIAP } from './src/App/Constants/StorageKey'

const App = () => {
  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, backgroundColor: Color_BG }
    })
  }, [])

  useEffect(() => {
    (async () => {
      // init IAP

      await InitIAPAsync(
        AllIAPProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP)
      )

      // init noti

      initNotificationAsync()
    })()
  }, [])

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