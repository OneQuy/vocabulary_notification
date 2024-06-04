export const NoPermissionText = "Make sure you have enabled notifications for the app in your phone Settings. If you have, try again!"
export const NotLatestConfig = "Can not get latest config. Please check your internet and try again."
export const PleaseSelectTargetLangText = 'Please set [Translation language] you wish to translate to firstly.'

export const NoNotificationPermissionLocalKey = 'no_permission'

const eng = {
  popularity_level: 'Popularity level',
  popularity_level_explain: "Popularity level of vocabulary words. The higher level, the less common the words are. Choose according to your needs.",
  level: 'Level',
  test_notification: 'Test notification',
  translate_to: 'Translation language',
  translate_language_explain: "Which language would you like to translate to?",
  translation_service: 'Translation service',
  services: 'Services',
  services_explain: "The translation service you wish to use for translation. Change this only if you encounter incorrectly translated words.",
  example_words: 'Example words',
  search_language: 'Search language...',
  repeat: 'Interval',
  hour: 'Hour',
  repeat_explain: "How long is the interval\nbetween notifications?",
  minute: 'Minute',
  invalid_input: 'Invalid input',
  set_notification: 'Set notification',
  setting_notification: 'Setting notifications',
  most_popular: 'Most Popular',
  rarest: 'Most unpopular',
  limit_words_per_day: 'Limit words per day',
  limit_words_per_day_explain: "Limit the number of vocabulary words you learn per day. If number of notifications exceeds this limit, the words will loop around.",
  num_days_to_push: 'Number of scheduled days',
  num_days_to_push_explain: "Number of days to schedule notifications for",
  noti_display: 'Notification display settings',
  noti_display_explain: "What information will be displayed in the notification?\nTap '##' for a demo.",
  no_limit: 'No limit',
  custom: 'Custom',
  word: 'word',
  day: 'day',
  downloading_data: 'Downloading data',
  loading_data: 'Loading data',
  translating: 'Translating',
  retry: 'Retry',
  cancel: 'Cancel',
  done: 'Done',
  not_show: 'Excluded time',
  not_show_explain: "Set time ranges during which notifications will not be shown to avoid interruptions during your resting or working time.",
  more_setting: 'More settings',
  history_empty: 'History is empty.',
  test: 'Test',
  confirm: 'Confirm',
  other_words: 'Other words',
  warning_clear_db: 'To change the translation service, the database needs resetting, and all learned words must be deleted. These words will also be cleared from the History panel, along with any upcoming notifications. You will need to set them again.\n\nTap Confirm to proceed with the change.',
  not_fount_suppport_target_lang: 'This service doesnt support ## or something errors. Please pick the language you wish to translate to again!',
  onequy_apps: 'Check out my other awesome apps',
  vocaby_lifetime: 'Vocaby Lifetime',
  restore_purchase: 'Restore purchase',
  restore: 'Restore',
  vocaby_lifetime_explain: "Upgrade once. Unlock all vocabularies and features.",
  current_price: "Current sale price",
  upgrade: "Upgrade",
  purchase_success: 'You have just upgraded successfully!\n\nThank you for purchasing. You unlocked all vocabularies and features of Vocaby!',
  and: 'and', 

  push_notice:
    `Every day, vocabulary notifications will be shown at these times: ###.
    
They are set up until 24/Oct/1994 at 00:00. Please open the app and set new words after this time.

Note: These times are estimates. Depending on the device and its status, sometimes notifications may not be shown or may be shown at different times. However, you don't need to worry about this. If notifications stop appearing completely, just re-open the app and set them up again!`,

  show_rank_of_word: 'Show popularity #rank',
  show_part_of_speech: 'Show part of speech',
  show_examble: 'Show examples (if any)',
  show_definitions: 'Show definitions',
  show_phonetic: 'Show phonetic (if any)',

  setup: 'Setup',
  history: 'History',
  about: 'About',

  popup_error: 'Oops',
  [NoNotificationPermissionLocalKey]: NoPermissionText,
  pls_set_target_lang: PleaseSelectTargetLangText,
  fail_translate: 'Can not get words transation.',
  fail_download: 'Fail to download.',
  restore_purchase_no_products: 'No product to restore',
} as const

export type LocalText = typeof eng

const useLocalText = (): LocalText => {
  return eng
}

export default useLocalText