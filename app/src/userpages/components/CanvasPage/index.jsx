// @flow

import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { userpages } from '../../../links'
import { formatPath } from '../../utils/url'

import Edit from './Edit'
import List from './List'

type Props = {}

export class DashboardPage extends Component<Props> {
    render() {
        return (
            <Switch>
                <Route exact path={userpages.canvasList}>
                    <Fragment>
                        <Helmet>
                            <title>Canvas</title>
                        </Helmet>
                        <List />
                    </Fragment>
                </Route>
                <Route path={formatPath(userpages.canvasEditor, ':id')} component={Edit} />
            </Switch>
        )
    }
}

export default DashboardPage
