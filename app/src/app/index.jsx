// @flow

import '$shared/assets/stylesheets'

import React from 'react'
import { Route as RouterRoute, Switch, Redirect, type Location } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import qs from 'query-string'

// Marketplace
import ProductPage from '$mp/containers/ProductPage'
import ProductPage2 from '$mp/containers/ProductPage2'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import CreateProductPage from '$mp/containers/CreateProductPage'
import EditProductPage from '$mp/containers/EditProductPage'
import EditProductPage2 from '$mp/containers/EditProductPage2'
import Products from '$mp/containers/Products'

// Auth
import SessionProvider from '$auth/components/SessionProvider'
import LoginPage from '$auth/components/LoginPage'
import LogoutPage from '$auth/components/LogoutPage'
import SignupPage from '$auth/components/SignupPage'
import ForgotPasswordPage from '$auth/components/ForgotPasswordPage'
import ResetPasswordPage from '$auth/components/ResetPasswordPage'
import RegisterPage from '$auth/components/RegisterPage'

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
import IntroductionDocsPage from '$docs/components/DocsPages/Introduction'
import GettingStartedDocsPage from '$docs/components/DocsPages/GettingStarted'
import StreamsDocsPage from '$docs/components/DocsPages/Streams'
import CanvasesDocsPage from '$docs/components/DocsPages/Canvases'
import CanvasModulesDocsPage from '$docs/components/DocsPages/CanvasModules'
import DashboardsDocsPage from '$docs/components/DocsPages/Dashboards'
import ProductsDocsPage from '$docs/components/DocsPages/Products'
import TutorialsDocsPage from '$docs/components/DocsPages/Tutorials'
import DataTokenDocsPage from '$docs/components/DocsPages/DataToken'
import CoreDocsPage from '$docs/components/DocsPages/Core'
import MarketplaceDocsPage from '$docs/components/DocsPages/Marketplace'
// import RunningNodeDocsPage from '$docs/components/DocsPages/RunningNode'
import SDKsDocsPage from '$docs/components/DocsPages/SDKs'
import APIDocsPage from '$docs/components/DocsPages/API'
import TechnicalNotesDocsPage from '$docs/components/DocsPages/TechnicalNotes'

// Editor
import CanvasEditor from '$editor/canvas'
import CanvasEmbed from '$editor/canvas/components/Embed'
import DashboardEditor from '$editor/dashboard'

import ModalRoot from '$shared/components/ModalRoot'
import Notifications from '$shared/components/Notifications'
import { formatPath } from '$shared/utils/url'
import { userIsAuthenticated } from '$auth/utils/userAuthenticated'
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
import Analytics from '$shared/utils/Analytics'
import routes from '$routes'

// Wrap authenticated components here instead of render() method
// Marketplace Auth
const CreateProductAuth = userIsAuthenticated(EditProductPage)
const CreateProductAuth2 = userIsAuthenticated(CreateProductPage)
const EditProductAuth = userIsAuthenticated(EditProductPage)
const EditProductAuth2 = userIsAuthenticated(EditProductPage2)

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
const DashboardEditorAuth = userIsAuthenticated(DashboardEditor)

// Other components
const ProductPurchasePage = (props) => <ProductPage overlayPurchaseDialog {...props} />
const ProductPublishPage = (props) => <ProductPage overlayPublishDialog {...props} />
const ProductPurchasePage2 = (props) => <ProductPage2 overlayPurchaseDialog {...props} />
const ProductPublishPage2 = (props) => <ProductPage2 overlayPublishDialog {...props} />

// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPageView)(RouterRoute)

const { marketplace, userpages, docs, editor } = links

const forwardTo = (routeFn: Function) => ({ location: { search } }: Location) => (
    <Redirect to={routeFn(qs.parse(search))} />
)

const AuthenticationRouter = () => ([
    <Route exact path={routes.login()} component={LoginPage} key="LoginPage" />,
    <Route exact path={routes.logout()} component={LogoutPage} key="LogoutPage" />,
    <Route path={routes.signUp()} component={SignupPage} key="SignupPage" />,
    <Route path={routes.forgotPassword()} component={ForgotPasswordPage} key="ForgotPasswordPage" />,
    <Route path={routes.resetPassword()} component={ResetPasswordPage} key="ResetPasswordPage" />,
    <Route exact path={routes.register()} component={RegisterPage} key="RegisterPage" />,
    <Redirect from="/login/auth" to={routes.login()} key="LoginRedirect" />,
    <Route exact path="/register/register" key="RegisterRedirect" render={forwardTo(routes.register)} />,
    <Route exact path="/register/resetPassword" key="ResetPasswordRedirect" render={forwardTo(routes.resetPassword)} />,
    <Redirect from="/register/forgotPassword" to={routes.forgotPassword()} key="ForgotPasswordRedirect" />,
])

const MarketplaceRouter = () => ([
    <Route exact path={marketplace.main} component={Products} key="Products" />,
    <Route exact path={links.marketplace.createProduct} component={CreateProductAuth} key="CreateProduct" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'purchase')} component={ProductPurchasePage} key="ProductPurchasePage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'publish')} component={ProductPublishPage} key="ProductPublishPage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage} key="ProductPage" />,
    <Route exact path={routes.editProduct()} component={EditProductAuth} key="EditProduct" />,
])

const CommunityProductsRouter = () => ([
    <Route exact path={routes.createProduct2()} component={CreateProductAuth2} key="CreateProduct2" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'purchase2')} component={ProductPurchasePage2} key="ProductPurchasePage2" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'publish2')} component={ProductPublishPage2} key="ProductPublishPage2" />,
    <Route exact path={formatPath(marketplace.products2, ':id')} component={ProductPage2} key="ProductPage2" />,
    <Route exact path={routes.editProduct2()} component={EditProductAuth2} key="EditProduct2" />,
])

const DocsRouter = () => ([
    <Route exact path={docs.introduction} component={IntroductionDocsPage} key="IntroductionPage" />,
    <Route exact path={docs.gettingStarted} component={GettingStartedDocsPage} key="GettingStartedPage" />,
    <Route exact path={docs.streams} component={StreamsDocsPage} key="StreamsPage" />,
    <Route exact path={docs.canvases} component={CanvasesDocsPage} key="CanvasesPage" />,
    <Route exact path={docs.canvasModules} component={CanvasModulesDocsPage} key="CanvasModulesPage" />,
    <Route exact path={docs.dashboards} component={DashboardsDocsPage} key="DashboardsPage" />,
    <Route exact path={docs.products} component={ProductsDocsPage} key="ProductsPage" />,
    <Route exact path={docs.tutorials} component={TutorialsDocsPage} key="TutorialsPage" />,
    <Route exact path={docs.dataToken} component={DataTokenDocsPage} key="DataTokenPage" />,
    <Route exact path={docs.core} component={CoreDocsPage} key="CorePage" />,
    <Route exact path={docs.marketplace} component={MarketplaceDocsPage} key="MarketplacePage" />,
    // <Route exact path={docs.runningNode} component={RunningNodeDocsPage} key="RunningNodePage" />,
    <Route exact path={docs.SDKs} component={SDKsDocsPage} key="SDKsPage" />,
    <Route exact path={docs.api} component={APIDocsPage} key="ApiPage" />,
    <Route exact path={docs.technicalNotes} component={TechnicalNotesDocsPage} key="technicalNotes" />,
    <Redirect from={docs.main} to={docs.introduction} key="DocsRoot" />,
])

const UserpagesRouter = () => ([
    <Route exact path={userpages.canvases} component={CanvasListAuth} key="CanvasesCanvasList" />,
    <Route exact path={userpages.profile} component={ProfilePageAuth} key="ProfilePage" />,
    <Route exact path={userpages.dashboards} component={DashboardListAuth} key="DashboardList" />,
    <Route exact path={formatPath(userpages.streamShow, ':id?')} component={StreamShowViewAuth} key="streamShow" />,
    <Route exact path={userpages.streams} component={StreamListViewAuth} key="StreamListView" />,
    <Route exact path={formatPath(userpages.streamPreview, ':streamId')} component={StreamLivePreviewAuth} key="StreamLivePreview" />,
    <Route exact path={userpages.transactions} component={TransactionListAuth} key="TransactionList" />,
    <Route exact path={userpages.purchases} component={PurchasesPageAuth} key="PurchasesPage" />,
    <Route exact path={userpages.products} component={ProductsPageAuth} key="ProductsPage" />,
    <Redirect from={userpages.main} to={userpages.streams} component={StreamListViewAuth} key="StreamListViewRedirect" />,
])

const EditorRouter = () => ([
    <Route exact path="/" component={Products} key="root" />, // edge case for localhost
    <Route exact path={formatPath(editor.canvasEditor, ':id?')} component={CanvasEditor} key="CanvasEditor" />,
    <Route exact path={formatPath(editor.canvasEmbed)} component={CanvasEmbed} key="CanvasEmbed" />,
    <Route exact path={formatPath(editor.dashboardEditor, ':id?')} component={DashboardEditorAuth} key="DashboardEditor" />,
])

const MiscRouter = () => ([
    <Route exact path="/error" component={ErrorPageView} key="ErrorPageView" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
])

const App = () => (
    <ConnectedRouter history={history}>
        <SessionProvider>
            <ModalRoot>
                <LocaleSetter />
                <AutoScroll />
                <Analytics />
                <Switch>
                    {AuthenticationRouter()}
                    {!!process.env.COMMUNITY_PRODUCTS && CommunityProductsRouter()}
                    {MarketplaceRouter()}
                    {DocsRouter()}
                    {UserpagesRouter()}
                    {EditorRouter()}
                    {MiscRouter()}
                </Switch>
                <Notifications />
                {isProduction() && <GoogleAnalyticsTracker />}
            </ModalRoot>
        </SessionProvider>
    </ConnectedRouter>
)

export default App
