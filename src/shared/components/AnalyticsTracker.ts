import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function AnalyticsTracker() {
    const { pathname } = useLocation()

    const createdRef = useRef(false)

    useEffect(() => {
        // @ts-expect-error lol
        console.log(window.gtag)
        // if (!GA_ID || !pathname) {
        //     return
        // }

        // if (!createdRef.current) {
        //     // GA script is already in the DOM. Calling `ReactGA.initialize` would
        //     // add another copy. We don't want that. `window.ga('create', …)` is
        //     // all we need.
        //     window.ga('create', GA_ID)
        //     createdRef.current = true
        // }

        // ReactGA.pageview(pathname)
    }, [pathname])
    return null
}
