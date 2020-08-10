import { useRef, useEffect } from 'react'

const useOnceEffect = (callback) => {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current()
    }, [])
}

export default useOnceEffect
