// https://notifee.app/react-native/docs

// --------------------------------
// INSTALL:
//
// npm i @notifee/react-native
//
// <key>NSUserNotificationsUsageDescription</key>
// <string>Please grant permission to receive notification.</string>
//
//  iOS: add Push Notifications on XCode
// --------------------------------

import notifee, { AndroidChannel, AndroidImportance, AndroidStyle, AuthorizationStatus, Notification, NotificationAndroid, NotificationSettings, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { Linking, Platform } from 'react-native';
import { AlertAsync } from './UtilsTS';

export type NotificationOption = {
  message: string,
  title: string,
  timestamp?: number,
}

var androidChannelId: string

var inited: boolean = false

// const InstructionEnableNotificatoniOSLink = 'https://docs.google.com/document/d/1QDORjz9ICbH3Eh9wDYxJCL3zJM-0Q-n8AAMh32SGqVM/edit?usp=sharing'

const DefaultAndroidLocalTextAlertIfDenied = {
  title: 'Enable Notifications',
  content: 'Please enable notifications in your phone Settings.',
  cancel: 'Cancel',
  settingBtn: 'Open Settings',
  // instructionBtn: 'Setting',
}

const ConvertNotificationOptionToNotification = (option: NotificationOption): Notification => {
  const noti: Notification = {
    title: option.title,
    body: option.message,
    android: {
      channelId: androidChannelId,
      style: {
        type: AndroidStyle.BIGTEXT,
        text: option.message,
      },
    } as NotificationAndroid,
  }

  return noti
}

/**
 * create channel (android) and register onBackgroundEvent
 * ND
 */
const CheckAndInitAsync = async () => {
  // console.log('[CheckAndInitAsync Notification] calling init');

  if (inited)
    return

  inited = true

  // console.log('[CheckAndInitAsync Notification] inited');

  // Create a channel (required for Android)

  androidChannelId = await notifee.createChannel({
    id: 'main',
    name: 'Main Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  } as AndroidChannel);

  notifee.onBackgroundEvent(async (_) => { })
}

export const RequestPermissionNotificationAsync = async (
  alertOpenSettingIfDenied?: boolean,
  localTextAlertIfDenied?: {
    title?: string,
    content?: string,
    cancel?: string,
    settingBtn?: string,
    instructionBtn?: string,
  }
): Promise<boolean> => {
  const res = await notifee.requestPermission()

  // ok

  if (res.authorizationStatus !== AuthorizationStatus.DENIED) {
    return true
  }

  // need alert to open setting (android)

  if (alertOpenSettingIfDenied === true) {
    const pressedSetting = await AlertAsync(
      localTextAlertIfDenied?.title ?? DefaultAndroidLocalTextAlertIfDenied.title,
      localTextAlertIfDenied?.content ?? DefaultAndroidLocalTextAlertIfDenied.content,

      // Platform.OS === 'android' ?
      //   (localTextAlertIfDenied?.settingBtn ?? DefaultAndroidLocalTextAlertIfDenied.settingBtn) : // right btn
      //   (localTextAlertIfDenied?.instructionBtn ?? DefaultAndroidLocalTextAlertIfDenied.instructionBtn), // right btn

      localTextAlertIfDenied?.settingBtn ?? DefaultAndroidLocalTextAlertIfDenied.settingBtn, // right btn
      localTextAlertIfDenied?.cancel ?? DefaultAndroidLocalTextAlertIfDenied.cancel, // left btn
    )

    if (pressedSetting) {
      // if (Platform.OS === 'android')
      //   await notifee.openNotificationSettings()
      // else
      await Linking.openSettings()
    }
  }

  return false
}

export const CancelAllLocalNotificationsAsync = async () => {
  await notifee.cancelAllNotifications()
}

export const DisplayNotificationAsync = async (option: NotificationOption): Promise<string> => {
  await CheckAndInitAsync()

  return await notifee.displayNotification(ConvertNotificationOptionToNotification(option))
}

export const SetNotificationAsync = async (option: NotificationOption) => { // main
  await CheckAndInitAsync()

  if (typeof option.timestamp !== 'number' ||
    !option.message ||
    !option.title)
    throw 'Notification option is invalid'

  if (option.timestamp < Date.now()) {
    // StorageLog_LogAsync('Overed noti: ' + new Date(option.timestamp).toLocaleString(), option.message)
    return
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: option.timestamp,
  }

  // StorageLog_LogAsync('set noti: ' + new Date(option.timestamp).toLocaleString() + ', ' + option.message)

  notifee.createTriggerNotification(
    ConvertNotificationOptionToNotification(option),
    trigger,
  );
}

/**
 * @param dayIdxFromToday 0 is today, 1 is tomorrow,...
 */
export const SetNotificationAsync_ForNextDay = (  // sub
  dayIdxFromToday: number,
  hourIn24h: number,
  option: NotificationOption,
  minute?: number,
  seconds?: number) => {
  const d = new Date()
  // minute = d.getMinutes() + RandomInt(1, 3)
  // hourIn24h = d.getHours()

  d.setDate(d.getDate() + dayIdxFromToday)
  d.setHours(hourIn24h)
  d.setMinutes(minute === undefined ? 0 : minute)
  d.setSeconds(seconds === undefined ? 0 : seconds)

  SetNotificationAsync({
    ...option,
    timestamp: d.getTime(),
  } as NotificationOption)
}

export const SetNotificationAsync_RemainSeconds = async (  // sub
  seconds: number,
  option: NotificationOption) => {
  await SetNotificationAsync({
    ...option,
    timestamp: Date.now() + seconds * 1000
  } as NotificationOption)
}