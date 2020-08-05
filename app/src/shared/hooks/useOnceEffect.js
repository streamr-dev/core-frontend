import { useRef, useEffect } from 'react'

export default (callback) => {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current()
    }, [])
}
