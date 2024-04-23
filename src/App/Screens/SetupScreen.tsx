import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { FontBold, FontSize } from '../Constants/Constants_FontSize'
import useTheme from '../Hooks/useTheme'
import useLocalText from '../Hooks/useLocalText'
import LucideIconTextEffectButton from '../../Common/Components/LucideIconTextEffectButton'
import { BorderRadius } from '../Constants/Constants_BorderRadius'
import { Gap, Outline } from '../Constants/Constants_Outline'
import { GetDayHourMinSecFromMs_ToString } from '../../Common/UtilsTS'
import HairLine from '../../Common/Components/HairLine'
import { WindowSize_Max } from '../../Common/CommonConstants'
import SlidingPopup from '../../Common/Components/SlidingPopup'
import { PopuplarityLevelNumber } from '../Constants/AppConstants'

const SetupScreen = () => {
  const theme = useTheme()
  const texts = useLocalText()

  const [showPopupPopularity, set_showPopupPopularity] = useState(false)
  const [displayPopularityLevelIdx, set_displayPopularityLevelIdx] = useState(0)
  const [loopMin, set_loopMin] = useState(30)

  const style = useMemo(() => {
    return StyleSheet.create({
      master: { flex: 1, },
      scrollView: { gap: Gap.Small, padding: Outline.Normal, },

      scrollViewSlidingPopup: { gap: Gap.Small, padding: Outline.Normal, },

      workTimeView: { flexDirection: 'row', gap: Gap.Normal, },
      workTimeChildView: { gap: Gap.Small, flex: 1, },

      header: { fontWeight: FontBold.Bold, fontSize: FontSize.Normal, color: theme.primary },

      normalBtnTxt: { fontSize: FontSize.Normal, },

      normalBtn: {
        borderWidth: WindowSize_Max * 0.0015,
        borderRadius: BorderRadius.Medium,
        padding: Outline.Normal,
        flexDirection: 'row',
        gap: Gap.Normal,
      },

      normalBtn_NoBorder: {
        padding: Outline.Normal,
      }
    })
  }, [theme])

  const workFromTxt = useMemo(() => {
    return '10:30'
  }, [])

  const workToTxt = useMemo(() => {
    return '20:00'
  }, [])

  const onPressShowPopupPopularityLevel = useCallback(() => {
    set_showPopupPopularity(true)
  }, [])

  const renderPopularityLevels = useCallback(() => {
    const arr = Array(PopuplarityLevelNumber).fill(undefined)

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollViewSlidingPopup}
      >
        {
          arr.map((i: any, index: number) => {
            const isSelected = displayPopularityLevelIdx === index

            return (
              <LucideIconTextEffectButton
                key={index}

                selectedColorOfTextAndIcon={theme.primary}
                unselectedColorOfTextAndIcon={theme.counterPrimary}

                // notChangeToSelected

                manuallySelected={isSelected}

                style={isSelected ? style.normalBtn : style.normalBtn_NoBorder}

                title={
                  texts.level +
                  ' ' +
                  (index + 1) +
                  (index === 0 ?
                    ` (${texts.most_popular})` :
                    (index === PopuplarityLevelNumber - 1 ? ` (${texts.rarest})` : '')
                  )
                }

                titleProps={{ style: style.normalBtnTxt }}
              />
            )
          })
        }
      </ScrollView>
    )
  }, [displayPopularityLevelIdx, theme, style])

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

          onPress={onPressShowPopupPopularityLevel}
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

        {/* work time */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <View style={style.workTimeView}>
          {/* work from */}
          <View style={style.workTimeChildView}>
            <Text style={style.header}>{texts.show_from}</Text>

            <LucideIconTextEffectButton
              unselectedColorOfTextAndIcon={theme.counterBackground}
              notChangeToSelected
              style={style.normalBtn}

              title={workFromTxt}
              titleProps={{ style: style.normalBtnTxt }}
            />
          </View>

          {/* work to */}
          <View style={style.workTimeChildView}>
            <Text style={style.header}>{texts.show_to}</Text>

            <LucideIconTextEffectButton
              unselectedColorOfTextAndIcon={theme.counterBackground}
              notChangeToSelected
              style={style.normalBtn}

              title={workToTxt}
              titleProps={{ style: style.normalBtnTxt }}
            />
          </View>
        </View>

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

        {/* save */}

        <HairLine marginVertical={Outline.Normal} color={theme.counterBackground} />

        <LucideIconTextEffectButton
          selectedBackgroundColor={theme.primary}

          selectedColorOfTextAndIcon={theme.counterPrimary}
          unselectedColorOfTextAndIcon={theme.counterBackground}

          notChangeToSelected
          manuallySelected={true}

          style={style.normalBtn}

          title={texts.save}
          titleProps={{ style: style.normalBtnTxt }}

          iconProps={{ name: 'Check', size: FontSize.Normal, }}
        />
      </ScrollView>

      {
        showPopupPopularity &&
        <SlidingPopup
          backgroundColor={theme.primary}
          child={renderPopularityLevels()}
          blurBackgroundColorInHex={theme.background}
          onPressClose={set_showPopupPopularity}
          childMaxHeight={'60%'}
        />
      }
    </View>
  )
}

export default SetupScreen