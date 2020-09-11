import { useReducer, useEffect } from 'react'
import { useSpring } from 'react-spring'
import useMeasure from '../useMeasure'
import usePrevious from './usePrevious'

/**
 * Transitions element from height: 0 to measured height.
 */

export default function useSlideIn({ isVisible } = {}) {
    isVisible = !!isVisible
    const previousIsVisible = !!usePrevious(isVisible)

    const [bind, { height }] = useMeasure() // attach bind to element to measure
    const justChanged = previousIsVisible !== isVisible

    const targetHeight = isVisible ? height : 0
    const selectedHeight = targetHeight

    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    useEffect(() => {
        if (justChanged) {
            // needs second render to perform transition correctly
            forceUpdate()
        }
    }, [justChanged, forceUpdate])

    const style = useSpring({
        height: selectedHeight,
        config: {
            mass: 1,
            friction: 62,
            tension: 700,
            precision: 0.00001,
        },
    })

    return [bind, style]
}
