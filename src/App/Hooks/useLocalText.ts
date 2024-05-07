export const NoPermissionText = 'No permission. Please grant the permission to receive vocabulary notifications!'
export const PleaseSelectTargetLangText = 'Please set a language you wish to translate to'

const eng = {
    popularity_level: 'Popuplarity level',
    level: 'Level',
    test_notification: 'Test notification',
    translate_to: 'Translate to',
    translation_service: 'Translation service',
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
    num_days_to_push: 'Number days to push',
    noti_display: 'Display settings',
    no_limit: 'No limit',
    custom: 'Custom',
    word: 'word',
    day: 'day',
    downloading_data: 'Downloading data',
    loading_data: 'Loading data',
    retry: 'Retry',
    cancel: 'Cancel',
    done: 'Done',
    not_show: 'Not show during these time ranges:',
    more_setting: 'More setting',
    back: 'Back',
    history_empty: 'History is empty.',
    
    show_rank_of_word: 'Show popularity #Rank of word',
    show_part_of_speech: 'Show part of speech (adv, adj, noun,...)',
    show_examble: 'Show examples (if any)',
    show_definitions: 'Show word definitions',
    show_phonetic: 'Show word phonetic (if any)',
    
    setup: 'Setup',
    history: 'History',
    about: 'About',
    
    popup_error: 'Oops',
    no_permission: NoPermissionText,
    pls_set_target_lang: PleaseSelectTargetLangText,
    fail_translate: 'Can not get words transation.',
    fail_download: 'Fail to download.',
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText