// @flow

import '$shared/assets/stylesheets'

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
import DashboardList from '$userpages/components/DashboardPage/List'
import CanvasList from '$userpages/components/CanvasPage/List'
import StreamShowView from '$userpages/components/StreamPage/Show'
import StreamListView from '$userpages/components/StreamPage/List'
import StreamLivePreview from '$userpages/components/StreamLivePreview'
import TransactionList from '$userpages/components/TransactionPage/List'
import ProfilePage from '$userpages/components/ProfilePage'
import PurchasesPage from '$userpages/components/PurchasesPage'
import ProductsPage from '$userpages/components/ProductsPage'

// Docs
import IntroductionPage from '$docs/components/IntroductionPage'
import GettingStartedPage from '$docs/components/GettingStartedPage'
import TutorialsPage from '$docs/components/TutorialsPage'
import VisualEditorPage from '$docs/components/VisualEditorPage'
import StreamrEnginePage from '$docs/components/StreamrEnginePage'
import MarketplacePage from '$docs/components/MarketplacePage'
import ApiPage from '$docs/components/ApiPage'

// Editor
import CanvasEditor from '$editor/canvas'
import DashboardEditor from '$editor/dashboard'

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
const StreamShowViewAuth = userIsAuthenticated(StreamShowView)
const StreamListViewAuth = userIsAuthenticated(StreamListView)
const StreamLivePreviewAuth = userIsAuthenticated(StreamLivePreview)
const TransactionListAuth = userIsAuthenticated(TransactionList)
const PurchasesPageAuth = userIsAuthenticated(PurchasesPage)
const ProductsPageAuth = userIsAuthenticated(ProductsPage)

// Editor Auth
const CanvasEditorAuth = userIsAuthenticated(CanvasEditor)
const DashboardEditorAuth = userIsAuthenticated(DashboardEditor)

// Other components
const ProductPurchasePage = (props) => <ProductPage overlayPurchaseDialog {...props} />
const ProductPublishPage = (props) => <ProductPage overlayPublishDialog {...props} />

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPageView)(RouterRoute)

const {
    internalLogin,
    marketplace,
    userpages,
    docs,
    editor,
} = links

const AuthenticationRouter = () => ([
    <Route exact path={routes.logout()} component={LogoutPage} key="LogoutPage" />,
    <Route exact path={formatPath(internalLogin, ':type?')} component={LoginRedirect} key="LoginRedirect" />,
])

const MarketplaceRouter = () => ([
    <Route exact path={links.root} component={Products} key="RootProducts" />,
    <Route exact path={marketplace.main} component={Products} key="Products" />,
    <Route exact path={links.marketplace.createProduct} component={CreateProductAuth} key="CreateProduct" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'purchase')} component={ProductPurchasePage} key="ProductPurchasePage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'publish')} component={ProductPublishPage} key="ProductPublishPage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage} key="ProductPage" />,
    <Route exact path={routes.editProduct()} component={EditProductAuth} key="EditProduct" />,
])

const DocsRouter = () => ([
    <Route exact path={docs.main} component={GettingStartedPage} key="GettingStartedPage" />,
    <Route exact path={docs.introduction} component={IntroductionPage} key="IntroductionPage" />,
    <Route exact path={docs.tutorials} component={TutorialsPage} key="TutorialsPage" />,
    <Route exact path={docs.visualEditor} component={VisualEditorPage} key="VisualEditorPage" />,
    <Route exact path={docs.streamrEngine} component={StreamrEnginePage} key="StreamrEnginePage" />,
    <Route exact path={docs.dataMarketplace} component={MarketplacePage} key="MarketplacePage" />,
    <Route exact path={docs.api} component={ApiPage} key="ApiPage" />,
])

const UserpagesRouter = () => ([
    <Route exact path={userpages.main} component={CanvasListAuth} key="CanvasList" />,
    <Route exact path={userpages.canvases} component={CanvasListAuth} key="CanvasesCanvasList" />,
    <Route exact path={userpages.profile} component={ProfilePageAuth} key="ProfilePage" />,
    <Route exact path={userpages.dashboards} component={DashboardListAuth} key="DashboardList" />,
    <Route exact path={formatPath(userpages.streamShow, ':id?')} component={StreamShowViewAuth} key="streamShow" />,
    <Route exact path={userpages.streams} component={StreamListViewAuth} key="StreamListView" />,
    <Route exact path={formatPath(userpages.streamPreview, ':streamId')} component={StreamLivePreviewAuth} key="StreamLivePreview" />,
    <Route exact path={userpages.transactions} component={TransactionListAuth} key="TransactionList" />,
    <Route exact path={userpages.purchases} component={PurchasesPageAuth} key="PurchasesPage" />,
    <Route exact path={userpages.products} component={ProductsPageAuth} key="ProductsPage" />,
])

const EditorRouter = () => ([
    <Route path={formatPath(editor.canvasEditor, ':id?')} component={CanvasEditorAuth} key="CanvasEditor" />,
    <Route path={formatPath(editor.dashboardEditor, ':id?')} component={DashboardEditorAuth} key="DashboardEditor" />,
])

const MiscRouter = () => ([
    <Route exact path="/error" component={ErrorPageView} key="ErrorPageView" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
])

const App = () => (
    <ConnectedRouter history={history}>
        <ModalRoot>
            <LocaleSetter />
            <AutoScroll />
            <Switch>
                {AuthenticationRouter()}
                {MarketplaceRouter()}
                {DocsRouter()}
                {UserpagesRouter()}
                {EditorRouter()}
                {MiscRouter()}
            </Switch>
            <Notifications />
            {isProduction() && <GoogleAnalyticsTracker />}
        </ModalRoot>
    </ConnectedRouter>
)

export default App
