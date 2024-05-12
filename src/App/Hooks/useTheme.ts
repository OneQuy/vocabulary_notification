const Dark_Default = {
    background: '#1c1c1c',
    counterBackground: '#ffffff',
    
    primary: '#dda',
    counterPrimary: '#1c1c1c',

    isDarkTheme: true,
} as const

type Theme = typeof Dark_Default

const useTheme = () : Theme => {
  return Dark_Default
}

export default useTheme

// export const Color_BG = '#151517'
export const Color_BG = '#1c1c1c'

export const Color_BG2 = '#242423'

export const Color_Border = '#424242'

export const Color_Text = '#ffffff'
export const Color_Text2 = '#9c9c9c'