// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'

import { userIsAuthenticated } from '$auth/utils/userAuthenticated'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import { formatPath } from '$shared/utils/url'
import routes from '$routes'
import links from '../links'

import ErrorPage from '$shared/components/ErrorPage'

// Userpages
import DashboardList from '$userpages/components/DashboardPage/List'
import CanvasList from '$userpages/components/CanvasPage/List'
import StreamShowView from '$userpages/components/StreamPage/Edit'
import StreamPage from '$userpages/components/StreamPage'
import NewStreamPage from '$userpages/components/NewStreamPage'
import StreamListView from '$userpages/components/StreamPage/List'
import StreamLivePreview from '$userpages/components/StreamLivePreview'
import TransactionList from '$userpages/components/TransactionPage/List'
import ProfilePage from '$userpages/components/ProfilePage'
import PurchasesPage from '$userpages/components/PurchasesPage'
import ProductsPage from '$userpages/components/ProductsPage'
import StatsPage from '$userpages/components/ProductsPage/Stats'
import MembersPage from '$userpages/components/ProductsPage/Members'
import EditProductPage from '$mp/containers/EditProductPage'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)

// Userpages Auth
const CanvasListAuth = userIsAuthenticated(CanvasList)
const ProfilePageAuth = userIsAuthenticated(ProfilePage)
const DashboardListAuth = userIsAuthenticated(DashboardList)
const StreamShowViewAuth = userIsAuthenticated(StreamShowView)
const StreamListViewAuth = userIsAuthenticated(StreamListView)
const StreamLivePreviewAuth = userIsAuthenticated(StreamLivePreview)
const TransactionListAuth = userIsAuthenticated(TransactionList)
const PurchasesPageAuth = userIsAuthenticated(PurchasesPage)
const ProductsPageAuth = userIsAuthenticated(ProductsPage)
const StatsPageAuth = userIsAuthenticated(StatsPage)
const MembersPageAuth = userIsAuthenticated(MembersPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)
const StreamPageAuth = userIsAuthenticated(StreamPage)
const NewStreamPageAuth = userIsAuthenticated(NewStreamPage)

const { userpages } = links

const UserpagesRouter = () => ([
    <Route exact path={userpages.canvases} component={CanvasListAuth} key="CanvasesCanvasList" />,
    <Route exact path={userpages.profile} component={ProfilePageAuth} key="ProfilePage" />,
    <Route exact path={userpages.dashboards} component={DashboardListAuth} key="DashboardList" />,
    <Route exact path={formatPath(userpages.streamShow, ':id?')} component={StreamShowViewAuth} key="streamShow" />,
    <Route exact path={routes.newStream()} component={NewStreamPageAuth} key="newStreamPage" />,
    <Route exact path={routes.stream()} component={StreamPageAuth} key="streamPage" />,
    <Route exact path={userpages.streams} component={StreamListViewAuth} key="StreamListView" />,
    <Route exact path={formatPath(userpages.streamPreview, ':streamId')} component={StreamLivePreviewAuth} key="StreamLivePreview" />,
    <Route exact path={userpages.transactions} component={TransactionListAuth} key="TransactionList" />,
    <Route exact path={userpages.purchases} component={PurchasesPageAuth} key="PurchasesPage" />,
    <Route exact path={userpages.products} component={ProductsPageAuth} key="ProductsPage" />,
    <Route exact path={routes.editProduct()} component={EditProductAuth} key="EditProduct" />,
    <Route exact path={routes.productStats()} component={StatsPageAuth} key="StatsPage" />,
    <Route exact path={routes.productMembers()} component={MembersPageAuth} key="MembersPage" />,
    <Redirect from={userpages.main} to={userpages.streams} component={StreamListViewAuth} key="StreamListViewRedirect" />,
])

export default UserpagesRouter
