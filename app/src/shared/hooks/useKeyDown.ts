import { useEffect } from 'react'
type Bindings = Record<string, () => void>
export default (bindings: Bindings) => {
    useEffect(() => {
        const onKeyDown = (e: React.KeyboardEvent<EventTarget>) => {
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
