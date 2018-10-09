import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import createHistory from 'history/createBrowserHistory'

import links from '../links'

import DashboardPage from './components/DashboardPage'
import StreamPage from './components/StreamPage'
import ProfilePage from './components/ProfilePage'
import ProfileChangePassword from './components/ProfilePage/ChangePassword'
import CanvasPage from './components/CanvasPage'
import StreamrClientProvider from './components/StreamrClientProvider'
// import Notifier from './components/StreamrNotifierWrapper'

import styles from './index.pcss'

function Placeholder(props) {
    return (
        <Container>
            TODO: {props.location.pathname}
        </Container>
    )
}

const history = createHistory({
    basename: process.env.PLATFORM_BASE_PATH,
})

const { userpages } = links

const App = () => (
    <StreamrClientProvider>
        <Router history={history}>
            <div className={styles.userpages}>
                {/* <Notifier /> */}
                <Switch>
                    <Route exact path={userpages.newCanvas} component={Placeholder} />
                    <Route exact path={userpages.profile} component={ProfilePage} />
                    <Route exact path={userpages.profileChangePassword} component={ProfileChangePassword} />
                    <Route path={userpages.dashboard} component={DashboardPage} />
                    <Route path={userpages.stream} component={StreamPage} />
                    <Route path={userpages.canvas} component={CanvasPage} />
                </Switch>
            </div>
        </Router>
    </StreamrClientProvider>
)

export default App
