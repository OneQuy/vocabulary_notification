const eng = {
    popularity_level: 'Popuplarity level',
    level: 'Level',
    test_notification: 'Test notification',
    translate_to: 'Translate to',
    tap_to_select: 'Tap to select...',
    search_language: 'Search language...',
    repeat: 'Repeat',
    invalid_end_time: "End time must be the time that comes after the Start time!",
    invalid_start_time: "Start time must be the time that comes before the End time!",
    invalid_input: 'Invalid input',
    set_notification: 'Set notification',
    setting_notification: 'Setting notifications',
    most_popular: 'Most Popular',
    rarest: 'Rarest',
    limit_words_per_day: 'Limit words per day',
    no_limit: 'No limit',
    custom: 'Custom',
    word: 'word',
    downloading_data: 'Downloading data',
    loading_data: 'Loading data',
    retry: 'Retry',
    cancel: 'Cancel',
    done: 'Done',
    not_show: 'Not show during these time ranges:',
    more_setting: 'More setting',
    back: 'Back',
    
    popup_error: 'Oops',
    no_permission: 'Can not setup. Please grant the permission to receive vocabulary notifications!',
    pls_set_target_lang: 'Please set a language you wish to translate to',
    fail_translate: 'Can not get words transation.',
    fail_download: 'Fail to download.',
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText