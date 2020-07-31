import React, { useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import scrollTo from '$shared/utils/scrollTo'

const AutoScrollHook = ({ hash: id }) => {
    const ref = useRef(null)

    const onceRef = useRef(false)

    const { hash } = useLocation()

    useEffect(() => {
        if (`#${id}` === hash && !onceRef.current) {
            onceRef.current = true
            scrollTo(ref.current)
        }
    }, [id, hash])

    return <div ref={ref} />
}

export default AutoScrollHook
