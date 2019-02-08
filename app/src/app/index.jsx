// @flow

import './globalStyles'

import React from 'react'
import { Route as RouterRoute, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

// Marketplace
import ProductPage from '$mp/containers/ProductPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import EditProductPage from '$mp/containers/EditProductPage'
import Products from '$mp/containers/Products'
import LoginPage from '$mp/containers/LoginPage'
import LogoutPage from '$auth/containers/LogoutPage'

// Userpages
import DashboardEditor from '$userpages/components/DashboardPage/EditorPage'
import DashboardList from '$userpages/components/DashboardPage/List'
import CanvasList from '$userpages/components/CanvasPage/List'
import StreamCreateView from '$userpages/components/StreamPage/Create'
import StreamShowView from '$userpages/components/StreamPage/Show'
import StreamListView from '$userpages/components/StreamPage/List'
import StreamLivePreview from '$userpages/components/StreamLivePreview'
import TransactionList from '$userpages/components/TransactionPage/List'
import ProfilePage from '$userpages/components/ProfilePage'
import PurchasesPage from '$userpages/components/PurchasesPage'
import ProductsPage from '$userpages/components/ProductsPage'

// Editor
import CanvasEdit from '$userpages/../editor'

// Docs
import IntroductionPage from '$docs/components/IntroductionPage'
import GettingStartedPage from '$docs/components/GettingStartedPage'
import TutorialsPage from '$docs/components/TutorialsPage'
import VisualEditorPage from '$docs/components/VisualEditorPage'
import StreamrEnginePage from '$docs/components/StreamrEnginePage'
import MarketplacePage from '$docs/components/MarketplacePage'
import ApiPage from '$docs/components/ApiPage'

import ModalRoot from '$shared/components/ModalRoot'
import Notifications from '$shared/components/Notifications'
import { formatPath } from '$shared/utils/url'
import { userIsAuthenticated, userIsNotAuthenticated } from '$mp/utils/auth'
import links from '../links'
import history from '../history'
import '../analytics'

import AutoScroll from '$shared/components/AutoScroll'
import LocaleSetter from '$mp/containers/LocaleSetter'
import NotFoundPage from '$mp/components/NotFoundPage'
import GoogleAnalyticsTracker from '$mp/components/GoogleAnalyticsTracker'
import isProduction from '$mp/utils/isProduction'
import ErrorPageView from '$mp/components/ErrorPageView'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import routes from '$routes'

// Wrap authenticated components here instead of render() method
// Marketplace Auth
const CreateProductAuth = userIsAuthenticated(EditProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)
const LoginRedirect = userIsNotAuthenticated(LoginPage)

// Userpages Auth
const CanvasListAuth = userIsAuthenticated(CanvasList)
const ProfilePageAuth = userIsAuthenticated(ProfilePage)
const DashboardListAuth = userIsAuthenticated(DashboardList)
const DashboardEditorAuth = userIsAuthenticated(DashboardEditor)
const StreamShowViewAuth = userIsAuthenticated(StreamShowView)
const StreamCreateViewAuth = userIsAuthenticated(StreamCreateView)
const StreamListViewAuth = userIsAuthenticated(StreamListView)
const StreamLivePreviewAuth = userIsAuthenticated(StreamLivePreview)
const TransactionListAuth = userIsAuthenticated(TransactionList)
const PurchasesPageAuth = userIsAuthenticated(PurchasesPage)
const ProductsPageAuth = userIsAuthenticated(ProductsPage)
const CanvasEditAuth = userIsAuthenticated(CanvasEdit)

// Other components
const ProductPurchasePage = (props) => <ProductPage overlayPurchaseDialog {...props} />
const ProductPublishPage = (props) => <ProductPage overlayPublishDialog {...props} />

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPageView)(RouterRoute)

const { userpages, docs, marketplace, internalLogin } = links

const DocsRouter = () => ([
    <Route exact path={docs.main} component={GettingStartedPage} key="GettingStartedPage" />,
    <Route exact path={docs.introduction} component={IntroductionPage} key="IntroductionPage" />,
    <Route exact path={docs.tutorials} component={TutorialsPage} key="TutorialsPage" />,
    <Route exact path={docs.visualEditor} component={VisualEditorPage} key="VisualEditorPage" />,
    <Route exact path={docs.streamrEngine} component={StreamrEnginePage} key="StreamrEnginePage" />,
    <Route exact path={docs.dataMarketplace} component={MarketplacePage} key="MarketplacePage" />,
    <Route exact path={docs.api} component={ApiPage} key="ApiPage" />,
])

const App = () => (
    <ConnectedRouter history={history}>
        <ModalRoot>
            <LocaleSetter />
            <AutoScroll />
            <Switch>
                <Route exact path={routes.logout()} component={LogoutPage} />
                <Route exact path={formatPath(internalLogin, ':type?')} component={LoginRedirect} />
                <Route exact path={links.root} component={Products} />
                <Route exact path={marketplace.main} component={Products} />
                <Route exact path={links.marketplace.createProduct} component={CreateProductAuth} />
                <Route exact path={formatPath(marketplace.products, ':id', 'purchase')} component={ProductPurchasePage} />
                <Route exact path={formatPath(marketplace.products, ':id', 'publish')} component={ProductPublishPage} />
                <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} />
                <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage} />
                <Route exact path={routes.editProduct()} component={EditProductAuth} />
                {DocsRouter()}
                <Route exact path={userpages.main} component={CanvasListAuth} />
                <Route exact path={userpages.canvases} component={CanvasListAuth} />
                <Route exact path={userpages.profile} component={ProfilePageAuth} />
                <Route exact path={userpages.dashboards} component={DashboardListAuth} />
                <Route exact path={formatPath(userpages.dashboardEditor, ':id')} component={DashboardEditorAuth} />
                <Route exact path={formatPath(userpages.streamShow, ':id?')} component={StreamShowViewAuth} />
                <Route exact path={userpages.streamCreate} component={StreamCreateViewAuth} />
                <Route exact path={userpages.streams} component={StreamListViewAuth} />
                <Route exact path={formatPath(userpages.streamPreview, ':streamId')} component={StreamLivePreviewAuth} />
                <Route exact path={userpages.transactions} component={TransactionListAuth} />
                <Route exact path={userpages.purchases} component={PurchasesPageAuth} />
                <Route exact path={userpages.products} component={ProductsPageAuth} />
                <Route exact path={formatPath(userpages.canvasEditor, ':id?')} component={CanvasEditAuth} />
                <Route exact path="/error" component={ErrorPageView} />
                <Route component={NotFoundPage} />
            </Switch>
            <Notifications />
            {isProduction() && <GoogleAnalyticsTracker />}
        </ModalRoot>
    </ConnectedRouter>
)

export default App
