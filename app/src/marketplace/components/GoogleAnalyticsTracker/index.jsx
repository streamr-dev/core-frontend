// @flow

import { useEffect } from 'react'
import { withRouter, type Location } from 'react-router-dom'
import ReactGA from 'react-ga'

const gaId = process.env.GOOGLE_ANALYTICS_ID

type Props = {
    location: Location,
}

export default withRouter(({ location = {} }: Props) => {
    if (!gaId) {
        return null
    }

    const { pathname = '' } = location

    // run once
    useEffect(() => {
        // Must call window.ga('create', gaId) instead of ReactGA.initialize(gaId)
        // since we don't want to inject the ga script to DOM again
        window.ga('create', gaId)
    }, [])

    useEffect(() => {
        if (!pathname) { return }
        ReactGA.pageview(pathname)
    }, [pathname])

    return null
})
