import React from 'react'
import TopBanner from './TopBanner'

export default class MainLayout extends React.Component {
    componentDidMount() {

    }

    render () {
        const { children } = this.props
        return (
            <div id="main-wrapper">
                <TopBanner />

                <div id="content-wrapper">
                    {children}
                </div>

            </div>

            <r:layoutResources/>
            <g:render template="/layouts/spinner"/>
        )

    }
}

