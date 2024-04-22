import { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

const useWindowOrientation = () => {
    const { width, height } = useWindowDimensions()
    const [isPortrait, set_isPortrait] = useState(width < height)

    useEffect(() => {
        set_isPortrait(width < height)
    }, [width, height])

    return {
        isPortrait,
        windowWidth: width,
        windowHeight: height,
        maxSize: Math.max(width, height),
    }
}

export default useWindowOrientation