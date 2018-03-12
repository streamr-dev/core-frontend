// @flow

import '@streamr/streamr-layout/css'
import '@streamr/streamr-layout/pcss'

import React from 'react'
import { Switch } from 'react-router-dom'
import Head from '../Head'
import Nav from '../Nav'

import type { Node } from 'react'

type Props = {
    children: Node,
}

export default class Page extends React.Component<Props> {
    render() {
        return [
            <Head key="head" />,
            <Nav key="nav" />,
            <Switch key="switch">
                {this.props.children}
            </Switch>,
        ]
    }
}
