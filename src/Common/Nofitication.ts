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

import notifee, { AndroidChannel, AndroidImportance, AndroidStyle, Notification, NotificationAndroid, NotificationSettings, TimestampTrigger, TriggerType } from '@notifee/react-native';

export type NotificationOption = {
  message: string,
  title: string,
  timestamp?: number,
}

var androidChannelId: string

var inited: boolean = false

/**
 * create channel (android)
 */
export const initNotificationAsync = async () => {
  if (inited)
    return

  inited = true

  // Create a channel (required for Android)

  androidChannelId = await notifee.createChannel({
    id: 'main',
    name: 'Main Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  } as AndroidChannel);

  notifee.onBackgroundEvent(async (_) => {})
}

export const requestPermissionNotificationAsync = async () : Promise<NotificationSettings> => {
  return await notifee.requestPermission()
}

export const cancelAllLocalNotificationsAsync = async () => {
  await notifee.cancelAllNotifications()
}

export const setNotification = (option: NotificationOption) => { // main
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
    {
      title: option.title,
      body: option.message,
      android: {
        channelId: androidChannelId,
        style: {
          type: AndroidStyle.BIGTEXT,
          text: option.message,
        },
      } as NotificationAndroid,
    } as Notification,

    trigger,
  );
}

/**
 * @param dayIdxFromToday 0 is today, 1 is tomorrow,...
 */
export const setNotification_ForNextDay = (  // sub
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
        
    setNotification({
      ...option,
      timestamp: d.getTime(),
    } as NotificationOption)
}

export const setNotification_RemainSeconds = (  // sub
  seconds: number,
  option: NotificationOption) => {
  setNotification({
    ...option,
    timestamp: Date.now() + seconds * 1000
  } as NotificationOption)
}