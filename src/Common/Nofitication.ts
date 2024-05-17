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
import { Platform } from 'react-native';
import { AlertAsync } from './UtilsTS';

export type NotificationOption = {
  message: string,
  title: string,
  timestamp?: number,
}

var androidChannelId: string

var inited: boolean = false

const DefaultAndroidLocalTextAlertIfDenied = {
  title: 'Enable Notifications',
  content: 'Please enable notifications in your settings.',
  cancel: 'Cancel',
  setting: 'Setting',
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

export const requestPermissionNotificationAsync = async (
  androidAlertOpenSettingIfDenied?: boolean,
  androidLocalTextAlertIfDenied?: {
    title?: string,
    content?: string,
    cancel?: string,
    setting?: string,
  }
): Promise<boolean> => {
  const res = await notifee.requestPermission()

  // ok

  if (res.authorizationStatus !== AuthorizationStatus.DENIED) {
    return true
  }

  // need alert to open setting (android)

  if (Platform.OS === 'android' && androidAlertOpenSettingIfDenied === true) {
    const pressedSetting = await AlertAsync(
      androidLocalTextAlertIfDenied?.title ?? DefaultAndroidLocalTextAlertIfDenied.title,
      androidLocalTextAlertIfDenied?.content ?? DefaultAndroidLocalTextAlertIfDenied.content,
      androidLocalTextAlertIfDenied?.setting ?? DefaultAndroidLocalTextAlertIfDenied.setting,
      androidLocalTextAlertIfDenied?.cancel ?? DefaultAndroidLocalTextAlertIfDenied.cancel,
    )

    if (pressedSetting) {
      await notifee.openNotificationSettings()
    }
  }

  return false
}

export const cancelAllLocalNotificationsAsync = async () => {
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