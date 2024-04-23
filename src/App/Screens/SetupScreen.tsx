import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'

const SetupScreen = () => {
  const theme = useTheme()
  const texts = useLocalText()

  const [displayPopularityLevelIdx, set_displayPopularityLevelIdx] = useState(0)

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, padding: Outline.Normal, gap: Gap.Small, },

      header: { fontWeight: FontBold.Bold, fontSize: FontSize.Normal, color: theme.primary },

      normalBtnTxt: { fontSize: FontSize.Normal, },

      normalBtn: {
        borderWidth: 0,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
      }
    })
  }, [theme])

  return (
    <View style={style.master}>
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
     
      {/* test noti */}

      <LucideIconTextEffectButton
        unselectedColorOfTextAndIcon={theme.counterBackground}
        notChangeToSelected
        style={style.normalBtn}

        title={texts.test_notification}
        titleProps={{ style: style.normalBtnTxt }}

        iconProps={{ name: 'Bell', size: FontSize.Normal, }}
      />
    </View>
  )
}

export default SetupScreen