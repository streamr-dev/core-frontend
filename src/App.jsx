// @flow

import React, {Component} from 'react'
import Helmet from 'react-helmet'
import Nav from './components/Nav'

import '@streamr/streamr-layout/css'
import '@streamr/streamr-layout/pcss'

import type {Node} from 'react'

type Props = {
    children: Node
}

type State = {}

export default class App extends Component<Props, State> {
    render() {
        return [
            <Helmet key="head">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            </Helmet>,
            <Nav key="nav" />,
            this.props.children,
        ]
    }
}
