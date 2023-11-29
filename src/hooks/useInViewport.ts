import { RefCallback, useEffect, useRef, useState } from 'react'

const isSSR = typeof IntersectionObserver === 'undefined'

export function useInViewport<T extends Element = Element>(): [RefCallback<T>, boolean] {
    const [target, setTarget] = useState<T | null>(null)

    const targetRef = useRef<T | null>(null)

    const [inViewport, setInViewport] = useState(false)

    const observerRef = useRef<undefined | IntersectionObserver>(
        isSSR
            ? undefined
            : new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                      if (entry.target === targetRef.current) {
                          setInViewport(entry.isIntersecting)
                      }
                  })
              }),
    )

    useEffect(() => {
        const { current: observer } = observerRef

        targetRef.current = target

        if (target) {
            observer?.observe(target)
        } else {
            setInViewport(false)
        }

        return () => {
            if (target) {
                observer?.unobserve(target)
            }
        }
    }, [target])

    useEffect(() => {
        const { current: observer } = observerRef

        return () => {
            observer?.disconnect()
        }
    }, [])

    useEffect(() => {
        if (isSSR) {
            // Fallback for when `IntersectionObserver` isn't there. We do it in `useEffect` to
            // cover non-SSR environments that don't give us `IntersectionObserver`.
            setInViewport(true)
        }
    }, [])

    return [setTarget, inViewport]
}
