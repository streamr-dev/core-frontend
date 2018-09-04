// @flow

import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import links from '../../links'
import { formatPath } from '../../utils/url'

import Edit from './Edit'
import List from './List'

type Props = {}

export class DashboardPage extends Component<Props> {
    render() {
        return (
            <Switch>
                <Route exact path={links.canvasList}>
                    <Fragment>
                        <Helmet>
                            <title>Canvas</title>
                        </Helmet>
                        <List />
                    </Fragment>
                </Route>
                <Route path={formatPath(links.canvasEditor, ':id')} component={Edit} />
            </Switch>
        )
    }
}

export default DashboardPage
