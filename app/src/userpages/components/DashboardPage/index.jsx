// @flow

import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import links from '../../../links'
import { formatPath } from '../../utils/url'

import EditorPage from './EditorPage'
import DashboardList from './List'

type Props = {}

export class DashboardPage extends Component<Props> {
    render() {
        return (
            <Switch>
                <Route exact path={links.userpages.dashboardList}>
                    <Fragment>
                        <Helmet>
                            <title>Dashboards</title>
                        </Helmet>
                        <DashboardList />
                    </Fragment>
                </Route>
                <Route path={formatPath(links.userpages.dashboardEditor, ':id')} component={EditorPage} />
            </Switch>
        )
    }
}

export default DashboardPage
