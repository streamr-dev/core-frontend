import React from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Page } from '@streamr/streamr-layout'
import classnames from 'classnames'
import { Container } from 'reactstrap'

import { formatPath } from './utils/url'
import links from './links'
import Nav from './components/Nav'
import DashboardPage from './components/DashboardPage'
import StreamPage from './components/StreamPage'
import ProfilePage from './components/ProfilePage'
import Loader from './components/Loader'
import store from './stores'

function Placeholder(props) {
    return (
        <Container>
            TODO: {props.location.pathname}
        </Container>
    )
}

const { styles } = Page
const App = () => (
    <Provider store={store}>
        <BrowserRouter>
            <div id="app" className={classnames(styles.page, styles.pageFramed)}>
                <Loader />
                <div className={styles.pageInner}>
                    <Nav opaque overlay />
                    <Switch>
                        <Route exact path={links.newCanvas} component={Placeholder} />
                        <Route exact path={links.canvasList} component={Placeholder} />
                        <Route exact path={links.profile} component={ProfilePage} />
                        <Route exact path={formatPath(links.dashboardList, ':id?')} component={DashboardPage} />
                        <Route exact path={formatPath(links.dashboardEditor, ':id?')} component={DashboardPage} />
                        <Route exact path={links.streamList} component={StreamPage} />
                        <Route exact path="/error" component={Placeholder} />
                        <Route exact path={links.streamrSite} component={Placeholder} />
                        <Route component={Placeholder} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
)

export default App
