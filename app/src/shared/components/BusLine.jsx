/* eslint-disable react/prop-types */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import scrollEventOptions from '$shared/utils/scrollEventOptions'
import getScrollY from '$shared/utils/getScrollY'
import scrollTo from '$shared/utils/scrollTo'
import useIsMounted from '$shared/hooks/useIsMounted'

const BusLineContext = createContext({
    link: () => {},
    stop: undefined,
    unlink: () => {},
})

export const useBusLine = () => (
    useContext(BusLineContext)
)

export const BusStop = ({ name }) => {
    const { link, unlink } = useBusLine()

    const ref = useRef()

    useEffect(() => {
        link([name, ref])

        return () => {
            unlink(name)
        }
    }, [name, link, unlink])

    return <div ref={ref} />
}

const getTop = (el) => (
    el ? el.getBoundingClientRect().top : 0
)

const BusLine = ({ children = null, dynamicScrollPosition }) => {
    const [refs, setRefs] = useState([])

    const [positions, setPositions] = useState([])

    const defaultStop = useMemo(() => (
        (positions.length ? positions[positions.length - 1] : [])[0]
    ), [positions])

    const link = useCallback(([name, ref]) => {
        setRefs((current) => [
            ...current,
            [name, ref],
        ])
    }, [])

    const unlink = useCallback((name) => {
        setRefs((current) => (
            current.filter(([n]) => n !== name)
        ))
    }, [])

    const [stop, setStop] = useState()

    const flags = useRef({
        wheel: false,
        mouseDown: true,
    })

    // Window resize effect responsible for updating bus stop positions in the new resized world.
    useEffect(() => {
        const onResize = () => {
            setPositions(() => {
                if (!document.body) {
                    return []
                }

                const bodyTop = getTop(document.body)

                return refs
                    .reduce((memo, [name, { current: el }]) => (
                        el ? [
                            ...memo,
                            [name, getTop(el) - bodyTop],
                        ] : memo
                    ), [])
                    .sort(([, a], [, b]) => b - a)
            })
        }

        onResize()

        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [refs])

    useEffect(() => {
        const onWheel = () => {
            flags.current.wheel = true
        }

        const onMouseDown = () => {
            flags.current.mouseDown = true
            flags.current.wheel = false
        }

        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('wheel', onWheel)

        return () => {
            window.removeEventListener('wheel', onWheel)
            window.removeEventListener('mousedown', onMouseDown)
        }
    }, [])

    const isMounted = useIsMounted()

    // Effect responsible for organic scrolling events. Programmatic scrolling is ignored by
    // the handlers.
    useEffect(() => {
        let scrolled = false

        const touchScroll = () => {
            if (document.body && isMounted() && flags.current.wheel) {
                const scrollY = getScrollY()
                const { innerHeight: windowHeight } = window
                const documentHeight = document.body.scrollHeight
                const guideY = scrollY + (dynamicScrollPosition ? (
                    Math.floor(windowHeight * (scrollY / (documentHeight - windowHeight)))
                ) : (
                    0
                ))

                const [name] = positions.find(([, posY]) => posY < guideY) || [defaultStop]

                setStop(name)
            }
            scrolled = false
        }

        const onScroll = () => {
            flags.current.mouseDown = false

            if (!scrolled) {
                scrolled = true

                window.requestAnimationFrame(touchScroll)
            }
        }

        window.addEventListener('scroll', onScroll, scrollEventOptions)

        return () => {
            window.removeEventListener('scroll', onScroll, scrollEventOptions)
        }
    }, [defaultStop, dynamicScrollPosition, positions, isMounted])

    const { hash } = useLocation()

    // Updates current step and smooth-scrolls to it. Applied ONLY to hash changes being a result
    // of link clicks. It's also responsible for silent scrolling to current location hash
    // on page load.
    useEffect(() => {
        if (!flags.current.mouseDown) {
            return
        }

        const [name, ref] = refs.find(([n]) => n === hash.replace(/^#/, '')) || [undefined, {}]

        if (name) {
            setStop(name)
        }

        scrollTo(ref.current)
    }, [hash, refs])

    const history = useHistory()

    // Updates location hash without storing it in the history. Applied ONLY to organic
    // scrolling (non-programmatic).
    useEffect(() => {
        if (!flags.current.wheel) {
            return
        }

        history.replace({
            hash: stop === defaultStop ? null : stop,
        })
    }, [stop, defaultStop, history])

    const value = useMemo(() => ({
        defaultStop,
        link,
        setStop,
        stop: stop || defaultStop,
        unlink,
    }), [
        defaultStop,
        link,
        stop,
        unlink,
    ])

    return (
        <BusLineContext.Provider value={value}>
            {children}
        </BusLineContext.Provider>
    )
}

export default BusLine
