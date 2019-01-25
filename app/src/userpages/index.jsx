import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import links from '../links'
import CanvasEdit from '../editor'

import DashboardEditor from './components/DashboardPage/EditorPage'
import DashboardList from './components/DashboardPage/List'
import CanvasList from './components/CanvasPage/List'
import StreamCreateView from './components/StreamPage/Create'
import StreamShowView from './components/StreamPage/Show'
import StreamListView from './components/StreamPage/List'
import StreamLivePreview from './components/StreamLivePreview'
import TransactionList from './components/TransactionPage/List'
import ProfilePage from './components/ProfilePage'
import StreamrClientProvider from './components/StreamrClientProvider'
import PurchasesPage from './components/PurchasesPage'
import ProductsPage from './components/ProductsPage'

import { formatPath } from '$shared/utils/url'

const { userpages } = links

const App = () => (
    <StreamrClientProvider>
        <Switch>
            <Redirect exact from={userpages.main} to={userpages.canvases} />
            <Route exact path={userpages.profile} component={ProfilePage} />
            <Route exact path={userpages.dashboards} component={DashboardList} />
            <Route path={formatPath(userpages.dashboardEditor, ':id')} component={DashboardEditor} />
            <Route path={formatPath(userpages.streamShow, ':id?')} component={StreamShowView} />
            <Route exact path={userpages.streamCreate} component={StreamCreateView} />
            <Route exact path={userpages.streams} component={StreamListView} />
            <Route path={formatPath(userpages.streamPreview, ':streamId')} component={StreamLivePreview} />
            <Route exact path={userpages.canvases} component={CanvasList} />
            <Route exact path={userpages.transactions} component={TransactionList} />
            <Route path={formatPath(userpages.canvasEditor, ':id?')} component={CanvasEdit} />
            <Route exact path={userpages.purchases} component={PurchasesPage} />
            <Route exact path={userpages.products} component={ProductsPage} />
        </Switch>
    </StreamrClientProvider>
)

export default App
