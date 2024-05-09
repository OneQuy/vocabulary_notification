const Light_Default = {
    background: '#ffffff',
    counterBackground: '#1c1c1c',
    
    primary: '#ffaabb',
    counterPrimary: '#1c1c1c',

    isDarkTheme: false,
}

const Dark_Default: Theme = {
    background: '#1c1c1c',
    counterBackground: '#ffffff',
    
    primary: '#dda',
    counterPrimary: '#1c1c1c',

    isDarkTheme: true,
} as const

type Theme = typeof Light_Default

const useTheme = () : Theme => {
  return Dark_Default
}

export default useTheme