import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'

import links from '../links'
import LandingPage from './LandingPage'

const history = createHistory({
    basename: process.env.PLATFORM_BASE_PATH,
})

const App = () => (
    <Router history={history}>
        <div>
            <Switch>
                <Route exact path={links.docs} component={LandingPage} />
            </Switch>
        </div>
    </Router>
)

export default App
