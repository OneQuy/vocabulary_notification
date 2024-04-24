const eng = {
    popularity_level: 'Popuplarity level',
    level: 'Level',
    test_notification: 'Test notification',
    show_every: 'Show every',
    // show_from: 'From',
    // show_to: 'To',
    set_notification: 'Set notification',
    most_popular: 'Most Popular',
    rarest: 'Rarest',
    limit_words_per_day: 'Limit words per day',
    no_limit: 'No limit',
    custom: 'Custom',
    word: 'word',
    not_show: 'NOT show time',
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText