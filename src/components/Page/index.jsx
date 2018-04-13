// @flow

import '@streamr/streamr-layout/css'
import '@streamr/streamr-layout/pcss'

import React from 'react'
import type { Node } from 'react'
import { Switch, withRouter } from 'react-router-dom'

import Head from '../Head'
import Nav from '../Nav'
import ModalContainer from '../ModalContainer'

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
        return [
            <Head key="head" />,
            <Nav key="nav" />,
            <Switch key="switch">
                {this.props.children}
            </Switch>,
            <ModalContainer key="modal" />,
        ]
    }
}

export default withRouter(Page)
