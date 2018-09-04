import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Page } from '@streamr/streamr-layout'
import classnames from 'classnames'
import { Container } from 'reactstrap'
import createHistory from 'history/createBrowserHistory'

import Nav from './components/Nav'
import DashboardPage from './components/DashboardPage'
import StreamPage from './components/StreamPage'
import ProfilePage from './components/ProfilePage'
import CanvasPage from './components/CanvasPage'
import StreamrClientProvider from './components/StreamrClientProvider'
import Notifier from './components/StreamrNotifierWrapper'

import links from './links'
import store from './stores'
import styles from './App.pcss'

function Placeholder(props) {
    return (
        <Container>
            TODO: {props.location.pathname}
        </Container>
    )
}

const history = createHistory({
    basename: process.env.USERPAGES_BASE_URL,
})

const App = () => (
    <Provider store={store}>
        <StreamrClientProvider>
            <Router history={history}>
                <div id="app" className={classnames(Page.styles.pageFramed)}>
                    <Nav id="nav" opaque overlay />
                    <Notifier />
                    <div className={classnames(Page.styles.pageInner, styles.pageInner)}>
                        <Switch>
                            <Route exact path={links.newCanvas} component={Placeholder} />
                            <Route exact path={links.profile} component={ProfilePage} />
                            <Route path={links.dashboard} component={DashboardPage} />
                            <Route path={links.stream} component={StreamPage} />
                            <Route exact path="/error" component={Placeholder} />
                            <Route path={links.canvas} component={CanvasPage} />
                            <Route exact path={links.streamrSite} component={Placeholder} />
                            <Route component={Placeholder} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </StreamrClientProvider>
    </Provider>
)

export default App
