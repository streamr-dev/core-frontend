/* eslint-disable react/prop-types */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import scrollEventOptions from '$shared/utils/scrollEventOptions'
import getScrollY from '$shared/utils/getScrollY'
import scrollTo from '$shared/utils/scrollTo'

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

// export const Link = ({
//     tag: Tag = 'a',
//     href,
//     to,
//     onClick: onClickProp,
//     ...props
// }) => {
//     const { wheelRef, stop, setStop, defaultStop } = useBusLine()

//     const history = useHistory()

//     const onClick = useCallback((e) => {
//         const el = document.getElementById(to)

//         if (el) {
//             e.preventDefault()

//             wheelRef.current = false

//             setStop(to)

//             history.push({
//                 hash: to === defaultStop ? null : to,
//             })

//             scrollTo(el)
//         }

//         if (onClickProp) {
//             onClickProp(e)
//         }
//     }, [to, onClickProp, history, defaultStop, setStop, wheelRef])

//     return (
//         <Tag
//             {...props}
//             active={to === stop}
//             href={`#${to}`}
//             onClick={onClick}
//         />
//     )
// }

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

    const wheelRef = useRef(false)

    useEffect(() => {
        const top = (el) => (
            el ? el.getBoundingClientRect().top : 0
        )

        const onResize = () => {
            setPositions(() => {
                if (!document.body) {
                    return []
                }

                const bodyTop = top(document.body)

                return refs
                    .reduce((memo, [name, { current: el }]) => (
                        el ? [
                            ...memo,
                            [name, top(el) - bodyTop],
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
            wheelRef.current = true
        }

        window.addEventListener('wheel', onWheel)

        return () => {
            window.removeEventListener('wheel', onWheel)
        }
    }, [])

    const mouseDownRef = useRef(true)

    useEffect(() => {
        let scrolled = false

        const touchScroll = () => {
            if (!document.body) {
                return
            }

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

            scrolled = false
        }

        const onScroll = () => {
            mouseDownRef.current = false

            if (!scrolled) {
                scrolled = true

                window.requestAnimationFrame(() => {
                    if (wheelRef.current) {
                        touchScroll()
                    } else {
                        scrolled = false
                    }
                })
            }
        }

        window.addEventListener('scroll', onScroll, scrollEventOptions)

        return () => {
            window.removeEventListener('scroll', onScroll, scrollEventOptions)
        }
    }, [defaultStop, dynamicScrollPosition, positions])

    const { hash } = useLocation()

    useEffect(() => {
        const onMouseDown = () => {
            mouseDownRef.current = true
            wheelRef.current = false
        }

        window.addEventListener('mousedown', onMouseDown)

        return () => {
            window.removeEventListener('mousedown', onMouseDown)
        }
    }, [])

    useEffect(() => {
        if (!mouseDownRef.current) {
            return
        }

        const [name, ref] = refs.find(([n]) => n === hash.replace(/^#/, '')) || [undefined, {}]

        if (name) {
            setStop(name)
        }

        scrollTo(ref.current)
    }, [hash, refs])

    const history = useHistory()

    useEffect(() => {
        if (!wheelRef.current) {
            return
        }

        history.replace({
            hash: stop === defaultStop ? null : stop,
        })
    }, [stop, defaultStop, history])

    const value = useMemo(() => ({
        defaultStop,
        link,
        stop: stop || defaultStop,
        setStop,
        unlink,
        wheelRef,
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
