import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import links from '../links'
import CanvasEdit from '../editor'

import DashboardEditor from './components/DashboardPage/EditorPage'
import DashboardList from './components/DashboardPage/List'
import CanvasList from './components/CanvasPage/List'
import StreamCreateView from './components/StreamPage/Create'
import StreamShowView from './components/StreamPage/Show'
import StreamListView from './components/StreamPage/List'
import ConfirmCsvImportView from './components/StreamPage/ConfirmCsvImport'
import ProfilePage from './components/ProfilePage'
import ProfileChangePassword from './components/ProfilePage/ChangePassword'
import StreamrClientProvider from './components/StreamrClientProvider'
import Layout from '$mp/containers/Layout'

import { formatPath } from '$shared/utils/url'

function Placeholder(props) {
    return (
        <Container>
            TODO: {props.location.pathname}
        </Container>
    )
}
const { userpages } = links

const App = () => (
    <StreamrClientProvider>
        <Layout>
            <Switch>
                <Redirect exact from={userpages.main} to={userpages.canvases} />
                <Route exact path={userpages.newCanvas} component={Placeholder} />
                <Route exact path={userpages.profile} component={ProfilePage} />
                <Route exact path={userpages.profileChangePassword} component={ProfileChangePassword} />
                <Route exact path={userpages.dashboards} component={DashboardList} />
                <Route path={formatPath(userpages.dashboardEditor, ':id')} component={DashboardEditor} />
                <Route path={formatPath(userpages.streamShow, ':id?')} component={StreamShowView} />
                <Route path={formatPath(userpages.streamShow, ':id?', 'confirmCsvImport')} component={ConfirmCsvImportView} />
                <Route exact path={userpages.streamCreate} component={StreamCreateView} />
                <Route exact path={userpages.streams} component={StreamListView} />
                <Route exact path={userpages.canvases} component={CanvasList} />
                <Route path={formatPath(userpages.canvasEditor, ':id')} component={CanvasEdit} />
            </Switch>
        </Layout>
    </StreamrClientProvider>
)

export default App
