import { useRef, useEffect } from 'react'

export default function usePreventNavigatingAway(message, fn) {
    const fnRef = useRef()
    fnRef.current = fn

    const messageRef = useRef()
    messageRef.current = message

    useEffect(() => {
        const onBeforeUnload = (e) => {
            if (fnRef.current()) {
                const event = e || window.event
                event.returnValue = messageRef.current // Gecko + IE
                return messageRef.current // Webkit, Safari, Chrome etc.
            }

            return ''
        }

        window.addEventListener('beforeunload', onBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload)
        }
    }, [])
}
