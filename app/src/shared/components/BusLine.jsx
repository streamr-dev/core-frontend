/* eslint-disable react/prop-types */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import passiveEventOptions from '$shared/utils/passiveEventOptions'
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

export const BusStop = ({ name, ...props }) => {
    const { link, unlink } = useBusLine()

    const ref = useRef()

    useEffect(() => {
        link([name, ref])

        return () => {
            unlink(name)
        }
    }, [name, link, unlink])

    return <div {...props} ref={ref} />
}

const getElementTop = (el) => {
    const { width, top } = el ? el.getBoundingClientRect() : {}
    return width ? top : null
}

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
        scrollbar: false,
    })

    // Window resize effect responsible for updating bus stop positions in the new resized world.
    useEffect(() => {
        const onResize = () => {
            setPositions(() => {
                if (!document.body) {
                    return []
                }

                const bodyTop = getElementTop(document.body)

                if (bodyTop == null) {
                    return []
                }

                return refs
                    .reduce((memo, [name, { current: el }]) => {
                        const top = getElementTop(el)

                        return (
                            top != null ? [
                                ...memo,
                                [name, top - bodyTop],
                            ] : memo
                        )
                    }, [])
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

        const onMouseDown = (e) => {
            flags.current.mouseDown = true
            flags.current.wheel = false
            flags.current.scrollbar = e.target instanceof HTMLHtmlElement
        }

        const onMouseUp = () => {
            flags.current.scrollbar = false
        }

        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('wheel', onWheel, passiveEventOptions)

        return () => {
            window.removeEventListener('wheel', onWheel, passiveEventOptions)
            window.removeEventListener('mouseup', onMouseUp)
            window.removeEventListener('mousedown', onMouseDown)
        }
    }, [])

    const isMounted = useIsMounted()

    // Effect responsible for organic scrolling events. Programmatic scrolling is ignored by
    // the handlers.
    useEffect(() => {
        let scrolled = false

        const touchScroll = () => {
            const { wheel, scrollbar } = flags.current

            if (document.body && isMounted() && (wheel || scrollbar)) {
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

        window.addEventListener('scroll', onScroll)

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [defaultStop, dynamicScrollPosition, positions, isMounted])

    const { hash, search } = useLocation()

    // Updates current stop and smooth-scrolls to it. Applied ONLY to hash changes being a result
    // of clicks. It's also responsible for silent scrolling to current location hash on page load.
    useEffect(() => {
        const { wheel, mouseDown, scrollbar } = flags.current

        if (!mouseDown && (wheel || scrollbar)) {
            return
        }

        const [name, ref] = refs.find(([n]) => n === hash.replace(/^#/, '')) || [undefined, {}]

        if (name) {
            setStop(name)
        }

        scrollTo(ref.current)
    }, [hash, refs])

    const history = useHistory()

    const searchRef = useRef(search)

    useEffect(() => {
        searchRef.current = search
    }, [search])

    // Updates location hash without storing it in the history. Applied ONLY
    // to non-programmatic scrolling.
    useEffect(() => {
        const { wheel, scrollbar } = flags.current

        if (!wheel || !scrollbar) {
            return
        }

        history.replace({
            search: searchRef.current,
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
