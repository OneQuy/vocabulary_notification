import { Dimensions, StyleSheet } from "react-native";
import { VersionToNumber } from "./UtilsTS";

export const LogoScr = require('../../assets/images/logo.png')

// window size

export const StartupWindowSize = Dimensions.get('window')

export const WindowSize_Max = Math.max(StartupWindowSize.width, StartupWindowSize.height)
export const WindowSize_Min = Math.min(StartupWindowSize.width, StartupWindowSize.height)

// version

export const VersionText = require('../../package.json').version
export const VersionAsNumber = VersionToNumber(VersionText)

// regex (https://uibakery.io/regex-library)

export const RegEx_Word_Number_Underscore = /^[a-z0-9_]+$/;
export const RegEx_Basic_Email = /^\S+@\S+\.\S+$/;

// slide / swipe handle

export const DefaultSlideHandle_Size = WindowSize_Max * 0.007
export const DefaultSlideHandle_AspectRatio = 10
export const DefaultSlideHandle_BorderRadius = WindowSize_Max * 0.1

// styles

export const CommonStyles = StyleSheet.create({
    flex_1:
    {
        flex: 1
    },

    width100PercentHeight100Percent:
    {
        width: '100%',
        height: '100%',
    },

    widthAndHeight100Percent_Absolute:
    {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },

    widthAndHeight0Percent:
    {
        width: '0%',
        height: '0%',
    },

    width100Percent_Height100Percent_PositionAbsolute_JustifyContentCenter_AlignItemsCenter:
    {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    justifyContentCenter_AlignItemsCenter:
    {
        justifyContent: 'center',
        alignItems: 'center',
    },

    flex1_justifyContentCenter_AlignItemsCenter:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    row_width100Percent:
    {
        flexDirection: 'row',
        width: '100%',
    },

    row_JustifyContentCenter_AlignItemsCenter:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    row:
    {
        flexDirection: 'row',
    },
});