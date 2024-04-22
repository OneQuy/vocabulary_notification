const eng = {
    overall: 'Overall',
    image: 'Image',
    background: 'Background',
    ratio: 'Radio',
    Scale: 'Scale',
    best_fit: 'Best fit',
    empty: 'Empty',
    pick_image: 'Pick image',
    
    // shadow
    
    shadow_none: 'None',
    shadow_small: 'Small',
    shadow_big: 'Big',
} as const

export type LocalText = typeof eng

const useLocalText = () : LocalText => {
  return eng
}

export default useLocalText