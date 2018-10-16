// @flow

import React, { Component } from 'react'
import { Switch } from 'react-router-dom'

import Header from '../Header'

type Props = {
    children: Node,
}

export class Page extends Component<Props> {
    render() {
        const { children } = this.props
        return (
            <div>
                <Header />
                <Switch>
                    {children}
                </Switch>
            </div>
        )
    }
}

export default Page
