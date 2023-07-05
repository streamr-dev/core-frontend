import { useState, useEffect } from 'react'

export const useWindowSize = (): { width: number; height: number } => {
    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })
    useEffect(() => {
        // if statement needed so that this hook will work with SSG Next.js apps
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                })
            }
            window.addEventListener('resize', handleResize)
            handleResize()
            return () => window.removeEventListener('resize', handleResize)
        }
    }, [])
    return windowSize
}
