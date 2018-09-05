// @flow

import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import links from '../../../links'
import { formatPath } from '../../utils/url'

import EditorPage from './EditorPage'
import DashboardList from './List'

export const DashboardPage = () => (
    <Switch>
        <Route exact path={links.dashboardList}>
            <Fragment>
                <Helmet>
                    <title>Dashboards</title>
                </Helmet>
                <DashboardList />
            </Fragment>
        </Route>
        <Route path={formatPath(links.dashboardEditor, ':id')} component={EditorPage} />
    </Switch>
)

export default DashboardPage
