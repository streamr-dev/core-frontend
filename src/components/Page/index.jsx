// @flow

import '@streamr/streamr-layout/css'
import '@streamr/streamr-layout/pcss'

import React, { Fragment } from 'react'
import type { Node } from 'react'
import { Switch, withRouter } from 'react-router-dom'

import Head from '../Head'
import Nav from '../../containers/Nav'

type Props = {
    children: Node,
    location: {
        pathname: string,
    }
}

const topOfPage = document.getElementById('root')

class Page extends React.Component<Props> {
    componentDidUpdate(prevProps: Props) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.onRouteChanged()
        }
    }

    onRouteChanged = () => {
        if (topOfPage) {
            topOfPage.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }

    render() {
        return (
            <Fragment>
                <Head />
                <Nav opaque />
                <Switch>
                    {this.props.children}
                </Switch>
            </Fragment>
        )
    }
}

export default withRouter(Page)
