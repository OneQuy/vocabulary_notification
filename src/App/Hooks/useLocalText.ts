const eng = {
    popularity_level: 'Popuplarity level',
    level: 'Level',
    test_notification: 'Test notification',
    translate_to: 'Translate to',
    tap_to_select: 'Tap to select...',
    search_language: 'Search language...',
    show_every: 'Show every',
    invalid_end_time: "End time must be the time that comes after the Start time!",
    invalid_start_time: "Start time must be the time that comes before the End time!",
    invalid_input: 'Invalid input',
    set_notification: 'Set notification',
    most_popular: 'Most Popular',
    rarest: 'Rarest',
    limit_words_per_day: 'Limit words per day',
    no_limit: 'No limit',
    custom: 'Custom',
    word: 'word',
    not_show: 'Not show during these time ranges:',
    popup_error: 'Oops',
    no_permission: 'Can not setup. Please grant the permission to receive vocabulary notifications!',
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText