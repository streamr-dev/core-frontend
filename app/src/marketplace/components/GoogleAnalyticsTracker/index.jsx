// @flow

import { Component } from 'react'
import { withRouter, type Location } from 'react-router-dom'
import ReactGA from 'react-ga'

// declare var ga: (type: string, ...args: any[]) => void

// const gaId = process.env.GOOGLE_ANALYTICS_ID

type Props = {
    location: Location,
}

class GoogleAnalyticsTracker extends Component<Props> {
    constructor(props: Props) {
        super(props)
        // Must call ga('create', gaId) instead of ReactGA.initialize(gaId) since we don't want to inject the ga script to DOM again
        // ga('create', gaId)
        this.logPageview(this.props.location.pathname)
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.location && (!this.props.location || newProps.location.pathname !== this.props.location.pathname)) {
            this.logPageview(newProps.location.pathname)
        }
    }

    logPageview = (page) => {
        ReactGA.pageview(page)
    }

    render = () => null
}

export default withRouter(GoogleAnalyticsTracker)
