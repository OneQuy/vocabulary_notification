const eng = {
    popularity_level: 'Popuplarity level',
    level: 'Level',
    test_notification: 'Test notification',
    show_every: 'Show every',
    show_from: 'Show from',
    show_to: 'Show to',
    save: 'Save',
    most_popular: 'Most Popular',
    rarest: 'Rarest',
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText