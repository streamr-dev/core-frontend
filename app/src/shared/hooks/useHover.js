import { useState, useEffect, useRef } from 'react'

// from https://gist.github.com/gragland/cfc4089e2f5d98dde5033adc44da53f8
function useHover() {
    const [value, setValue] = useState(false)

    const ref = useRef(null)

    useEffect(() => {
        const handleMouseOver = () => setValue(true)
        const handleMouseOut = () => setValue(false)
        const element = ref && ref.current

        if (element) {
            element.addEventListener('mouseover', handleMouseOver)
            element.addEventListener('mouseout', handleMouseOut)

            return () => {
                element.removeEventListener('mouseover', handleMouseOver)
                element.removeEventListener('mouseout', handleMouseOut)
            }
        }

        return () => {}
    }, [ref])

    return [ref, value]
}

export default useHover
