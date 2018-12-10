// @flow

import React, { Component } from 'react'
import { withRouter, type Location } from 'react-router-dom'
import ReactGA from 'react-ga'
import Helmet from 'react-helmet'

const GA_ID = process.env.GOOGLE_ANALYTICS_ID

type Props = {
    location: Location,
}

class GoogleAnalyticsTracker extends Component<Props> {
    constructor(props: Props) {
        super(props)
        // Must call window.ga('create', gaId) instead of ReactGA.initialize(gaId) since we don't want to inject the ga script to DOM again
        if (process.env.IS_BROWSER) {
            window.ga('create', GA_ID)
            this.logPageview(this.props.location.pathname)
        }
    }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.location && (!this.props.location || newProps.location.pathname !== this.props.location.pathname)) {
            this.logPageview(newProps.location.pathname)
        }
    }

    logPageview = (page) => {
        ReactGA.pageview(page)
    }

    render = () => (
        <Helmet>
            {/*
                Global site tag (gtag.js) - Google Analytics
                Is added here so that it can be read without rendering js on the page.
                This enables using GA to prove the ownership of the website/domain for Google.
                We also set 'send_page_view': false so that the initial page load wouldn't send page view, otherwise it would get sent twice
            */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script>
                {`
                    window.ga=window.ga||function(){ (ga.q=ga.q||[]).push(arguments)};ga.l=+new Date
                    window.dataLayer = window.dataLayer || []
                    function gtag(){dataLayer.push(arguments)}
                    gtag('js', new Date())
                    gtag('config', '${GA_ID}', {
                        'send_page_view': false,
                    })
                `}
            </script>
        </Helmet>
    )
}

export default withRouter(GoogleAnalyticsTracker)
