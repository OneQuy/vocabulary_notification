import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { GetDayHourMinSecFromMs_ToString } from '../../Common/UtilsTS'
import HairLine from '../../Common/Components/HairLine'
import { WindowSize_Max } from '../../Common/CommonConstants'

const SetupScreen = () => {
  const theme = useTheme()
  const texts = useLocalText()

  const [displayPopularityLevelIdx, set_displayPopularityLevelIdx] = useState(0)
  const [loopMin, set_loopMin] = useState(30)

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, padding: Outline.Normal, },
      scrollView: { gap: Gap.Small, },

      header: { fontWeight: FontBold.Bold, fontSize: FontSize.Normal, color: theme.primary },

      normalBtnTxt: { fontSize: FontSize.Normal, },

      normalBtn: {
        borderWidth: WindowSize_Max * 0.0015,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
      }
    })
  }, [theme])

  return (
    <View style={style.master}>
      <ScrollView contentContainerStyle={style.scrollView} showsVerticalScrollIndicator={false}>
        {/* popularity_level */}

        <Text style={style.header}>{texts.popularity_level}</Text>

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={texts.level + ' ' + (displayPopularityLevelIdx + 1)}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'BookAIcon', size: FontSize.Normal, }}
        />

        {/* loop interval */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <Text style={style.header}>{texts.show_every}</Text>

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={GetDayHourMinSecFromMs_ToString(loopMin * 60 * 1000)}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Clock', size: FontSize.Normal, }}
        />

        {/* test noti */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <LucideIconTextEffectButton
          unselectedColorOfTextAndIcon={theme.counterBackground}
          notChangeToSelected
          style={style.normalBtn}

          title={texts.test_notification}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Bell', size: FontSize.Normal, }}
        />
      </ScrollView>
    </View>
  )
}

export default SetupScreen