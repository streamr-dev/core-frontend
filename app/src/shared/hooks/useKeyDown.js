// @flow

import { useEffect } from 'react'

type Bindings = {
    [string]: () => void,
}

export default (bindings: Bindings) => {
    useEffect(() => {
        const onKeyDown = (e: SyntheticKeyboardEvent<EventTarget>) => {
            if (Object.prototype.hasOwnProperty.call(bindings, e.key)) {
                bindings[e.key]()
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [bindings])
}
