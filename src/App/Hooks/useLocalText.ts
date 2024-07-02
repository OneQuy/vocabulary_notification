export const NoPermissionText = "Make sure you have enabled notifications for the app in your phone Settings. If you have, try again!"
export const NotLatestConfig = "Can not get latest config. Please check your internet and try again."
export const PleaseSelectTargetLangText = 'Please set [Translation language] you wish to translate to firstly.'
export const CanNotSetupUserData = 'Can not setup data. Please check your internet and try again.'
export const PopupTitleError = 'Error'
export const RetryText = 'Retry'

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
  interval_minimum_required: "The interval must be at least ## minutes.",
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
  retry: RetryText,
  later: 'Later',
  cancel: 'Cancel',
  done: 'Done',
  not_show: 'Excluded time',
  not_show_explain: "Set time ranges during which notifications will not be shown to avoid interruptions during your resting or working time.",
  more_setting: 'Optionals',
  history_empty: 'History is empty.',
  test: 'Test',
  confirm: 'Confirm',
  other_words: 'Other words',
  warning_clear_db: 'To change the translation service, the database needs resetting, and all learned words must be deleted. These words will also be cleared from the History panel, along with any upcoming notifications. You will need to set them again.\n\nTap Confirm to proceed with the change.',
  not_fount_suppport_target_lang: 'This service doesnt support ## or something errors. Please pick the language you wish to translate to again!',
  onequy_apps: 'Check out my other awesome apps',
  vocaby_lifetime: 'Vocaby Lifetime',
  lifetime: 'Lifetime',
  pro: 'Pro',
  pro_item_content: "Currently, you can choose 1 level for free. Upgrade to unlock all ### vocabulary popularity levels and learn up to @@@ words.",
  restore_purchase: 'Restore purchase',
  restore: 'Restore',
  vocaby_lifetime_explain: "Upgrade once. Unlock all vocabularies and features.",
  current_price: "Current sale price",
  upgrade: "Upgrade",
  purchase_success: 'You have just upgraded successfully!\n\nThank you for purchasing. You unlocked all vocabularies and features of Vocaby!',
  and: 'and',
  congrats: 'Congratulations!',
  contact_dev: 'Contact the developer',
  community: 'Community',
  follow_community: "Follow to stay updated with the latest news about ###.",
  copied: 'Copied',
  run_out_push: 'Awesome!! You have learned all the vocabulary from the last setup. Please open the app to re-setup the new words and continue learning!',
  already_set: "You already set notifications until 24/Oct/1994 at 00:00.",
  expired_set: "All vocabulary is shown. Please set your next ones!",
  out_of_trial: "You are out of the trial period. Please upgrade to Lifetime to unlock all levels!",
  introduce_trial: "You can change to any level during the ##-day trial. After this period, you can continue using the selected level. Upgrade to Lifetime to unlock all levels from now on.",
  purchased_but_cannot_sync: "Purchase successful! You have the Lifetime subscription, but data cannot sync to the server. Please check your internet and try again.",
  sale_ends: "The sale ends on ###",
  welcome: "Welcome to ",
  welcome_content: "### is a simple app that helps you learn English vocabulary effortlessly through notifications. Each notification introduces a new word.",
  welcome_item_0: "Customize the frequency of notifications",
  welcome_item_1: "Supports translations in over 100 languages",
  welcome_item_2: "### levels of vocabulary popularity",
  welcome_item_3: "A total of up to ### words to learn",
  start_text: "Okayyyyyy",
  first_guide_app: "You selected ###! Everything is ready now. You can tap 'Set notification' to start and learn vocabulary! Or you can adjust the settings to fit your needs and then tap it!",
  
  push_notice:
    `Every day, vocabulary notifications will be shown at these times: ###.
    
They are set up until 24/Oct/1994 at 00:00. Please open the app and set new ones after this time.`,

  push_notice_device: `Note: These times are estimates. Depending on the device and its status, sometimes notifications may not be shown or may be shown at different times. However, you don't need to worry about this. If notifications stop appearing completely, just re-open the app and set them up again!`,

  show_rank_of_word: 'Show popularity #rank',
  show_part_of_speech: 'Show part of speech (adv, noun,... )',
  show_examble: 'Show examples (if any)',
  show_definitions: 'Show english definitions',
  show_phonetic: 'Show phonetic (if any) (Hello: /heˈloʊ/)',

  setup: 'Setup',
  history: 'History',
  about: 'About',

  popup_error: PopupTitleError,
  [NoNotificationPermissionLocalKey]: NoPermissionText,
  pls_set_target_lang: PleaseSelectTargetLangText,
  fail_translate: 'Can not get words translation. Please try again!',
  fail_download: 'Fail to download.',
  restore_purchase_no_products: 'No product to restore',
  cannot_setup_data: CanNotSetupUserData
} as const

export type LocalText = typeof eng

const useLocalText = (): LocalText => {
  return eng
}

export default useLocalText