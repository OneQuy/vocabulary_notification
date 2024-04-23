const eng = {
    popularity_level: 'Popuplarity level',
    level: 'Level'
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText