// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'

import { userIsAuthenticated } from '$auth/utils/userAuthenticated'
import withErrorBoundary from '$shared/utils/withErrorBoundary'

import ErrorPage from '$shared/components/ErrorPage'

// Userpages
import DashboardList from '$userpages/components/DashboardPage/List'
import CanvasList from '$userpages/components/CanvasPage/List'
import StreamPage from '$userpages/components/StreamPage'
import NewStreamPage from '$userpages/components/StreamPage/New'
import StreamListView from '$userpages/components/StreamPage/List'
import TransactionList from '$userpages/components/TransactionPage/List'
import ProfilePage from '$userpages/components/ProfilePage'
import PurchasesPage from '$userpages/components/PurchasesPage'
import ProductsPage from '$userpages/components/ProductsPage'
import StatsPage from '$userpages/components/ProductsPage/Stats'
import MembersPage from '$userpages/components/ProductsPage/Members'
import EditProductPage from '$mp/containers/EditProductPage'
import routes from '$routes'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)

// Userpages Auth
const CanvasListAuth = userIsAuthenticated(CanvasList)
const ProfilePageAuth = userIsAuthenticated(ProfilePage)
const DashboardListAuth = userIsAuthenticated(DashboardList)
const StreamListViewAuth = userIsAuthenticated(StreamListView)
const TransactionListAuth = userIsAuthenticated(TransactionList)
const PurchasesPageAuth = userIsAuthenticated(PurchasesPage)
const ProductsPageAuth = userIsAuthenticated(ProductsPage)
const StatsPageAuth = userIsAuthenticated(StatsPage)
const MembersPageAuth = userIsAuthenticated(MembersPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)
const NewStreamPageAuth = userIsAuthenticated(NewStreamPage)

const UserpagesRouter = () => ([
    <Route exact path={routes.canvases.index()} component={CanvasListAuth} key="CanvasesCanvasList" />,
    <Route exact path={routes.profile()} component={ProfilePageAuth} key="ProfilePage" />,
    <Route exact path={routes.dashboards.index()} component={DashboardListAuth} key="DashboardList" />,
    <Route exact path={routes.streams.new()} component={NewStreamPageAuth} key="newStreamPage" />,
    <Route exact path={routes.streams.show()} component={StreamPage} key="streamPage" />,
    <Route exact path={routes.streams.index()} component={StreamListViewAuth} key="StreamListView" />,
    <Route exact path={routes.transactions()} component={TransactionListAuth} key="TransactionList" />,
    <Route exact path={routes.subscriptions()} component={PurchasesPageAuth} key="PurchasesPage" />,
    <Route exact path={routes.products.index()} component={ProductsPageAuth} key="ProductsPage" />,
    <Route exact path={routes.products.edit()} component={EditProductAuth} key="EditProduct" />,
    <Route exact path={routes.products.stats()} component={StatsPageAuth} key="StatsPage" />,
    <Route exact path={routes.products.members()} component={MembersPageAuth} key="MembersPage" />,
    <Redirect from={routes.core()} to={routes.streams.index()} component={StreamListViewAuth} key="StreamListViewRedirect" />,
])

export default UserpagesRouter
