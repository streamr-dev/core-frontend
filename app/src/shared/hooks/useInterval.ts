import { useEffect, useRef } from 'react'

// Adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback: (...args: any) => any, delay: number) => {
    const savedCallback = useRef<(...args: any) => any>()
    useEffect(() => {
        savedCallback.current = callback
    })
    useEffect(() => {
        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current()
            }
        }

        if (delay !== null) {
            const id = setInterval(tick, delay)
            return () => clearInterval(id)
        }

        return undefined
    }, [delay])
}

export default useInterval
