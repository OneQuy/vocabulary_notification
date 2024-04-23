const eng = {
    popularity_level: 'Popuplarity level',
    level: 'Level',
    test_notification: 'Test notification',
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText