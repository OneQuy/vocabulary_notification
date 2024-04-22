// LucideIconTextEffectButton - 7 Apr 2024 (Creating StyleShot)

import { View, Text, StyleSheet, ColorValue, TouchableOpacity, Animated, ViewStyle, TextStyle, Image, ImagePropsBase, GestureResponderEvent, TextProps } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LucideIcon, LucideIconProps } from './LucideIcon'
import { SafeValue } from '../UtilsTS'
import { CommonStyles } from '../CommonConstants'

interface Props extends React.ComponentProps<typeof TouchableOpacity> {
    selectedColorOfTextAndIcon?: ColorValue,
    unselectedColorOfTextAndIcon?: ColorValue,

    selectedBackgroundColor?: ColorValue,

    /**
     * if you want to control selected state outside 
     */
    manuallySelected?: boolean,

    /**
     * keep unselected state as always
     */
    notChangeToSelected?: boolean,

    effectDuration?: number,
    effectType?: 'scale' | 'fade',
    effectDelay?: number,

    iconProps?: LucideIconProps,

    title?: string,
    titleProps?: TextProps,

    backgroundImageProps?: ImagePropsBase,

    /**
     * should flex: 1 for fitting parent.
     */
    customBackground?: React.JSX.Element,
}

/**
 * ## Note
 * * restProps is props for master view (TouchableOpacity)
 * * style={{ borderWidth: 0 }} for hairlineWidth
 * ## Note maintaince
 * * remember undefining prop in finalMasterStyle
 * ## Usage
 * ```tsx
<LucideIconTextEffectButton
    style={{
        flexDirection: 'row',
        gap: 10,
        
        width: 200,
        height: 100,

        borderWidth: 0, // hair
        borderRadius: 5, 

        paddingVertical: 10,
        padding: 20
    }}
    
    onPress={() => console.log('pressed')}

    // notChangeToSelected={true}

    // manuallySelected={isSelecting}

    effectType={'scale'}
    effectDuration={100}

    // effectType={'fade'}
    // effectDuration={400}

    iconProps={{ name: 'Plus', size: 30, strokeWidth: 5 }}

    title='Hello'
    titleStyle={{ fontWeight: 'bold', fontSize: 30 }}

    backgroundImageProps={{
        source: { uri: 'https://t4.ftcdn.net/jpg/00/67/24/59/360_F_67245954_ejVa8C414CwJ9X0UadIFu1QEUjeLuFnO.jpg' }
    }}

    // customBackground={<LinearGradient colors={['#ddaabb', '#bbaaff', 'gold']} style={{ flex: 1 }} />}
    // customBackground={<View style={{ backgroundColor: 'red', flex: 1 }} />}
/>
 * ```
 */
const LucideIconTextEffectButton = ({
    selectedColorOfTextAndIcon = 'white',
    unselectedColorOfTextAndIcon = 'black',

    selectedBackgroundColor = 'black',

    notChangeToSelected,
    manuallySelected,

    effectDuration = 100,
    effectType = undefined,
    effectDelay,

    iconProps,

    title,
    titleProps,

    backgroundImageProps,

    customBackground,

    ...masterRestProps
}: Props) => {
    const [isSelected, set_isSelected] = useState(false)

    const animatedRef = useRef(new Animated.Value(0)).current

    // memos

    const finalPaddingTop = useMemo(() => {
        const paddingTop = SafeValue((masterRestProps.style as ViewStyle)?.paddingTop, -1)

        if (paddingTop < 0) {
            const paddingVer = SafeValue((masterRestProps.style as ViewStyle)?.paddingVertical, -1)

            if (paddingVer >= 0)
                return paddingVer
            else
                return SafeValue((masterRestProps.style as ViewStyle)?.padding, 0)
        }
        else
            return paddingTop
    }, [masterRestProps.style])

    const finalPaddingBottom = useMemo(() => {
        const padding = SafeValue((masterRestProps.style as ViewStyle)?.paddingBottom, -1)

        if (padding < 0) {
            const paddingVer = SafeValue((masterRestProps.style as ViewStyle)?.paddingVertical, -1)

            if (paddingVer >= 0)
                return paddingVer
            else
                return SafeValue((masterRestProps.style as ViewStyle)?.padding, 0)
        }
        else
            return padding
    }, [masterRestProps.style])

    const finalPaddingRight = useMemo(() => {
        const padding = SafeValue((masterRestProps.style as ViewStyle)?.paddingRight, -1)

        if (padding < 0) {
            const paddingHor = SafeValue((masterRestProps.style as ViewStyle)?.paddingHorizontal, -1)

            if (paddingHor >= 0)
                return paddingHor
            else
                return SafeValue((masterRestProps.style as ViewStyle)?.padding, 0)
        }
        else
            return padding
    }, [masterRestProps.style])

    const finalPaddingLeft = useMemo(() => {
        const padding = SafeValue((masterRestProps.style as ViewStyle)?.paddingLeft, -1)

        if (padding < 0) {
            const paddingHor = SafeValue((masterRestProps.style as ViewStyle)?.paddingHorizontal, -1)

            if (paddingHor >= 0)
                return paddingHor
            else
                return SafeValue((masterRestProps.style as ViewStyle)?.padding, 0)
        }
        else
            return padding
    }, [masterRestProps.style])

    const finalBorderWidth = useMemo(() => {
        const w = SafeValue((masterRestProps.style as ViewStyle)?.borderWidth, -2)

        if (w <= -2)
            return undefined
        else if (w <= 0)
            return StyleSheet.hairlineWidth
        else
            return w
    }, [masterRestProps.style])

    const finalBorderRadius = useMemo(() => {
        const w = SafeValue((masterRestProps.style as ViewStyle)?.borderRadius, 0)

        if (w <= 0)
            return undefined
        else
            return w
    }, [masterRestProps.style])

    const finalMasterStyle: ViewStyle = useMemo(() => {
        return Object.assign(
            {
                alignItems: 'center',
                justifyContent: 'center'
            } as ViewStyle,
            masterRestProps.style,
            {
                borderRadius: undefined,
                borderWidth: undefined,

                paddingTop: undefined,
                paddingBottom: undefined,
                paddingRight: undefined,
                paddingLeft: undefined,
                padding: undefined,
                paddingHorizontal: undefined,
                paddingVertical: undefined,
            } as ViewStyle)
    }, [masterRestProps.style])

    const textAndIconColor = useMemo(() => {
        if (isSelected) {
            return selectedColorOfTextAndIcon
        }
        else
            return unselectedColorOfTextAndIcon
    }, [isSelected, selectedColorOfTextAndIcon, unselectedColorOfTextAndIcon])

    const styles = useMemo(() => {
        return StyleSheet.create(
            {
                title: Object.assign({
                    color: textAndIconColor,

                    paddingBottom: finalPaddingBottom,
                    paddingRight: finalPaddingRight,

                    paddingTop: (finalMasterStyle.flexDirection === 'row' || finalMasterStyle.flexDirection === 'row-reverse') ?
                        finalPaddingTop :
                        (iconProps ? undefined : finalPaddingTop),

                    paddingLeft: (finalMasterStyle.flexDirection === 'row' || finalMasterStyle.flexDirection === 'row-reverse') ?
                        (iconProps ? undefined : finalPaddingLeft) :
                        finalPaddingLeft,
                } as TextStyle, titleProps?.style),

                iconView: {
                    paddingTop: finalPaddingTop,
                    paddingLeft: finalPaddingLeft,

                    paddingBottom: (finalMasterStyle.flexDirection === 'row' || finalMasterStyle.flexDirection === 'row-reverse') ?
                        finalPaddingBottom :
                        (title ? undefined : finalPaddingBottom),

                    paddingRight: (finalMasterStyle.flexDirection === 'row' || finalMasterStyle.flexDirection === 'row-reverse') ?
                        (title ? undefined : finalPaddingRight) :
                        finalPaddingRight,
                },

                borderView: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',

                    borderColor: textAndIconColor,
                    borderWidth: finalBorderWidth,
                    borderRadius: finalBorderRadius,
                },

                animatedView: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',

                    backgroundColor: (backgroundImageProps || customBackground) ?
                        undefined :
                        selectedBackgroundColor,

                    overflow: 'hidden',
                    borderRadius: finalBorderRadius,
                },
            })
    }, [
        title,
        titleProps?.style,

        textAndIconColor,
        iconProps,

        unselectedColorOfTextAndIcon,

        selectedBackgroundColor,
        backgroundImageProps,
        customBackground,

        finalBorderRadius,
        finalBorderWidth,

        finalPaddingTop,
        finalPaddingBottom,
        finalPaddingRight,
        finalPaddingLeft,

        finalMasterStyle.flexDirection,
    ])

    // callbacks

    const playEffect = useCallback((selected: boolean) => {
        const toValue = selected ? 1 : 0

        if (effectType !== undefined) {
            Animated.timing(
                animatedRef,
                {
                    delay: effectDelay,
                    useNativeDriver: false,
                    toValue,
                    duration: effectDuration ?? 100,
                }
            ).start()
        }
        else {
            animatedRef.setValue(toValue)
        }
    }, [effectDuration, effectType, effectDelay])

    const onPress = useCallback((e: GestureResponderEvent) => {
        if (manuallySelected === true && isSelected)
            return

        if (typeof masterRestProps.onPress === 'function')
            masterRestProps.onPress(e)

        if (notChangeToSelected)
            return

        playEffect(!isSelected)

        set_isSelected(v => !v)
    }, [
        manuallySelected,
        isSelected,
        playEffect,
        notChangeToSelected,
        masterRestProps.onPress
    ])

    // manuallySelected changed

    useEffect(() => {
        if (manuallySelected === undefined)
            return

        if (manuallySelected !== isSelected) {
            playEffect(manuallySelected)
            set_isSelected(manuallySelected)
        }
    }, [manuallySelected])

    // if (title === '90%')
    //     console.log(title)
    // console.log(title, finalPaddingTop, finalMasterStyle)

    return (
        <TouchableOpacity
            activeOpacity={notChangeToSelected ? undefined : 1}
            onPress={onPress}
            style={finalMasterStyle}
        >
            {/* effect view */}
            {
                (effectType !== undefined || isSelected) &&
                <Animated.View style={[
                    styles.animatedView,
                    { transform: [{ scale: effectType === 'scale' ? animatedRef : 1 }] },
                    { opacity: effectType === 'fade' ? animatedRef : 1 }
                ]}>
                    {
                        backgroundImageProps &&
                        <Image
                            {...backgroundImageProps}
                            style={CommonStyles.width100PercentHeight100Percent}
                        />
                    }

                    {
                        !backgroundImageProps &&
                        customBackground
                    }
                </Animated.View>
            }

            {/* border view */}
            {
                (finalBorderRadius !== undefined || finalBorderWidth !== undefined) &&
                <View style={styles.borderView} />
            }

            {/* icon */}
            {
                iconProps &&
                <View style={styles.iconView}>
                    <LucideIcon  {...iconProps} color={textAndIconColor} />
                </View>
            }

            {/* title */}
            {
                title &&
                <Text
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    {...titleProps}
                    style={styles.title}
                >
                    {title}
                </Text>
            }
        </TouchableOpacity>
    )
}

export default LucideIconTextEffectButton