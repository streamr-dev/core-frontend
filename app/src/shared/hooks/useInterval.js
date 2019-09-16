import { useEffect, useRef } from 'react'

// Adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback, delay) => {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    })

    useEffect(() => {
        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current()
            }
        }

        const id = setInterval(tick, delay)
        return () => clearInterval(id)
    }, [delay])
}

export default useInterval
