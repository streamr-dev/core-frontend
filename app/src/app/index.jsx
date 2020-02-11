// @flow

import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'

import React from 'react'
import { Route as RouterRoute, Switch, Redirect, type Location } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import qs from 'query-string'

// Marketplace
import ProductPage from '$mp/containers/deprecated/ProductPage'
import ProductPage2 from '$mp/containers/ProductPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import EditProductPage from '$mp/containers/deprecated/EditProductPage'
import EditProductPage2 from '$mp/containers/EditProductPage'
import Products from '$mp/containers/Products'
import NewProductPage from '$mp/components/NewProductPage'

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
import StatsPage from '$userpages/components/ProductsPage/Stats'
import MembersPage from '$userpages/components/ProductsPage/Members'

// Docs Pages
import IntroductionDocsPage from '$docs/components/DocsPages/Introduction'
// Getting Started Docs
import GettingStartedDocsPage from '$docs/components/DocsPages/GettingStarted'
// Streams Docs
import IntroToStreamsDocsPage from '$docs/components/DocsPages/Streams/IntroToStreams'
import UsingStreamsInCoreDocsPage from '$docs/components/DocsPages/Streams/UsingStreamsInCore'
import UsingStreamsViaApiDocsPage from '$docs/components/DocsPages/Streams/UsingStreamsViaApi'
import UsingStreamsViaSDKDocsPage from '$docs/components/DocsPages/Streams/UsingStreamsViaSDK'
import PartitioningDocsPage from '$docs/components/DocsPages/Streams/Partitioning'
import IntegrationPatternsDocsPage from '$docs/components/DocsPages/Streams/IntegrationPatterns'
import EndToEndEncryptionDocsPage from '$docs/components/DocsPages/Streams/EndToEndEncryption'
import DataSigningAndVerificationDocsPage from '$docs/components/DocsPages/Streams/DataSigningAndVerification'
// Canvases Docs
import IntroToCanvasesDocsPage from '$docs/components/DocsPages/Canvases/IntroToCanvases'
import ModulesBasicsDocsPage from '$docs/components/DocsPages/Canvases/ModulesBasics'
import ModulesAdvancedDocsPage from '$docs/components/DocsPages/Canvases/ModulesAdvanced'
// Module Reference Docs
import ModuleReferenceHelp from '$docs/components/DocsPages/ModuleReference/HelpModules'

// Dashboard Docs
import DashboardsDocsPage from '$docs/components/DocsPages/Dashboards'
// Products Docs
import IntroToProductsDocsPage from '$docs/components/DocsPages/Products/IntroToProducts'
import DataUnionsDocsPage from '$docs/components/DocsPages/Products/DataUnions'
// Tutorials Docs
import BuildingPubSubDocsPage from '$docs/components/DocsPages/Tutorials/BuildingPubSub'
import BuildingCustomModuleDocsPage from '$docs/components/DocsPages/Tutorials/BuildingCustomModule'
// DATA Token Docs
import DataTokenDocsPage from '$docs/components/DocsPages/DataToken'
// Core Docs
import IntroToCoreDocsPage from '$docs/components/DocsPages/Core/IntroToCore'
// import StreamsInCoreDocsPage from '$docs/components/DocsPages/Core/UsingStreamsInCore'
import UsingCanvasesInCoreDocsPage from '$docs/components/DocsPages/Core/UsingCanvasesInCore'
// import DashboardsInCoreDocsPage from '$docs/components/DocsPages/Core/UsingDashboardsInCore'
// import ProductsInCoreDocsPage from '$docs/components/DocsPages/Core/UsingProductsInCore'
// Marketplace Docs
import IntroToMarketplaceDocsPage from '$docs/components/DocsPages/Marketplace/IntroToMarketplace'
// Running a Node Docs
// import RunningNodeDocsPage from '$docs/components/DocsPages/RunningNode'
// SDK Docs
import SDKsDocsPage from '$docs/components/DocsPages/SDKs'
// API Docs
import ApiOverviewDocsPage from '$docs/components/DocsPages/API/ApiOverview'
import AuthenticationDocsPage from '$docs/components/DocsPages/API/Authentication'
import ApiExplorerDocsPage from '$docs/components/DocsPages/API/ApiExplorer'
// Technical Notes Docs
import TechnicalNotesDocsPage from '$docs/components/DocsPages/TechnicalNotes'

// Editor
import CanvasEditor from '$editor/canvas'
import CanvasEmbed from '$editor/canvas/components/Embed'
import DashboardEditor from '$editor/dashboard'

import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '$shared/contexts/ModalApi'
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
const StatsPageAuth = userIsAuthenticated(StatsPage)
const MembersPageAuth = userIsAuthenticated(MembersPage)

// Editor Auth
const DashboardEditorAuth = userIsAuthenticated(DashboardEditor)

// Other components
const ProductPurchasePage = (props) => <ProductPage overlayPurchaseDialog {...props} />
const ProductPublishPage = (props) => <ProductPage overlayPublishDialog {...props} />

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

const MarketplaceRouter = () => (process.env.NEW_MP_CONTRACT ? [
    <Route exact path={marketplace.main} component={Products} key="Products" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage2} key="ProductPage2" />,
    <Route exact path={routes.newProduct()} component={NewProductPage} key="NewProductPage" />,
] : [
    <Route exact path={marketplace.main} component={Products} key="Products" />,
    <Route exact path={links.marketplace.createProduct} component={CreateProductAuth} key="CreateProduct" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'purchase')} component={ProductPurchasePage} key="ProductPurchasePage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'publish')} component={ProductPublishPage} key="ProductPublishPage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'streamPreview', ':streamId')} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={formatPath(marketplace.products, ':id')} component={ProductPage} key="ProductPage" />,
    <Route exact path={formatPath(marketplace.products, ':id', 'edit')} component={EditProductAuth} key="EditProduct" />,
])

const DocsRouter = () => ([
    // Introduction routes
    <Route exact path={docs.introduction.root} component={IntroductionDocsPage} key="IntroductionPage" />,
    <Redirect exact from={docs.main} to={docs.introduction.root} key="DocsMain" />,
    // Getting Started routes
    <Route exact path={docs.gettingStarted.root} component={GettingStartedDocsPage} key="GettingStartedPage" />,
    // Streams routes
    <Route exact path={docs.streams.introToStreams} component={IntroToStreamsDocsPage} key="IntroToStreamsPage" />,
    <Redirect exact from={docs.streams.root} to={docs.streams.introToStreams} key="StreamsRoot" />,
    <Route exact path={docs.streams.usingStreamsInCore} component={UsingStreamsInCoreDocsPage} key="UsingStreamsInCore" />,
    <Route exact path={docs.streams.usingStreamsViaApi} component={UsingStreamsViaApiDocsPage} key="UsingStreamsViaApi" />,
    <Route exact path={docs.streams.usingStreamsViaSDK} component={UsingStreamsViaSDKDocsPage} key="UsingStreamsViaSDK" />,
    <Route exact path={docs.streams.partitioning} component={PartitioningDocsPage} key="Partitioning" />,
    <Route exact path={docs.streams.integrationPatterns} component={IntegrationPatternsDocsPage} key="IntegrationPatterns" />,
    <Route exact path={docs.streams.endToEndEncryption} component={EndToEndEncryptionDocsPage} key="EndToEndEncryption" />,
    <Route exact path={docs.streams.dataSigningAndVerification} component={DataSigningAndVerificationDocsPage} key="DataSigningAndVerification" />,
    // Canvases routes
    <Route exact path={docs.canvases.introToCanvases} component={IntroToCanvasesDocsPage} key="IntroToCanvases" />,
    <Redirect exact from={docs.canvases.root} to={docs.canvases.introToCanvases} key="CanvasesRoot" />,
    <Route exact path={docs.canvases.usingCanvases} component={UsingCanvasesInCoreDocsPage} key="UsingCanvases" />,
    <Route exact path={docs.canvases.modulesBasics} component={ModulesBasicsDocsPage} key="ModulesBasics" />,
    <Route exact path={docs.canvases.modulesAdvanced} component={ModulesAdvancedDocsPage} key="ModulesAdvanced" />,
    // Dashboard routes
    <Route exact path={docs.dashboards.root} component={DashboardsDocsPage} key="DashboardsPage" />,
    // Products routes
    <Route exact path={docs.products.introToProducts} component={IntroToProductsDocsPage} key="IntroToProducts" />,
    <Redirect exact from={docs.products.root} to={docs.products.introToProducts} key="ProductsRoot" />,
    <Route exact path={docs.products.dataUnions} component={DataUnionsDocsPage} key="DataUnions" />,
    // Module Reference routes
    <Route
        exact
        path={docs.moduleReference.boolean}
        render={() => (<ModuleReferenceHelp category="Boolean" pageTitle="Boolean Modules" />)}
        key="BooleanDocsPage"
    />,
    <Redirect exact from={docs.moduleReference.root} to={docs.moduleReference.boolean} key="ModuleReferencePage" />,
    <Route
        exact
        path={docs.moduleReference.customModules}
        render={() => (<ModuleReferenceHelp category="Custom Modules" pageTitle="Custom Modules" />)}
        key="CMDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.input}
        render={() => (<ModuleReferenceHelp category="Input" pageTitle="Input Modules" />)}
        key="InputDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.integrations}
        render={() => (<ModuleReferenceHelp category="Integrations" pageTitle="Integration Modules" />)}
        key="IntegrationsDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.list}
        render={() => (<ModuleReferenceHelp category="List" pageTitle="List Modules" />)}
        key="ListDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.map}
        render={() => (<ModuleReferenceHelp category="Map" pageTitle="Map Modules" />)}
        key="MapDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.streams}
        render={() => (<ModuleReferenceHelp category="Streams" pageTitle="Stream Modules" />)}
        key="StreamsDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.text}
        render={() => (<ModuleReferenceHelp category="Text" pageTitle="Text Modules" />)}
        key="TextDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.timeAndDate}
        render={() => (<ModuleReferenceHelp category="Time & Date" pageTitle="Time & Date Modules" />)}
        key="TimeAndDateDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.timeSeries}
        render={() => (<ModuleReferenceHelp category="Time Series" pageTitle="Time Series Modules" />)}
        key="TimeSeriesDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.utils}
        render={() => (<ModuleReferenceHelp category="Utils" pageTitle="Utils Modules" />)}
        key="UtilsDocsPage"
    />,
    <Route
        exact
        path={docs.moduleReference.visualizations}
        render={() => (<ModuleReferenceHelp category="Visualizations" pageTitle="Visualization Modules" />)}
        key="VisualizationsDocsPage"
    />,
    // Tutorials routes
    <Route exact path={docs.tutorials.buildingPubSub} component={BuildingPubSubDocsPage} key="BuildingPubSub" />,
    <Redirect exact from={docs.tutorials.root} to={docs.tutorials.buildingPubSub} key="TutorialsRoot" />,
    <Route exact path={docs.tutorials.buildingCustomModule} component={BuildingCustomModuleDocsPage} key="BuildingCustomModule" />,
    // DATA Token routes
    <Route exact path={docs.dataToken.root} component={DataTokenDocsPage} key="DataTokenPage" />,
    // Core routes
    <Route exact path={docs.core.introToCore} component={IntroToCoreDocsPage} key="IntroToCore" />,
    <Redirect exact from={docs.core.root} to={docs.core.introToCore} key="CoreRoot" />,
    // <Route exact path={docs.core.streamsInCore} component={StreamsInCoreDocsPage} key="streamsInCore" />,
    // <Route exact path={docs.core.canvasesInCore} component={UsingCanvasesInCoreDocsPage} key="canvasesInCore" />,
    // <Route exact path={docs.core.dashboardsInCore} component={DashboardsInCoreDocsPage} key="dashboardsInCore" />,
    // <Route exact path={docs.core.productsInCore} component={ProductsInCoreDocsPage} key="productsInCore" />,
    // Marketplace routes
    <Route exact path={docs.marketplace.introToMarketplace} component={IntroToMarketplaceDocsPage} key="IntroToMarketplace" />,
    <Redirect exact from={docs.marketplace.root} to={docs.marketplace.introToMarketplace} key="MarketplaceRoot" />,
    <Route exact path={docs.marketplace.dataUnions} component={DataUnionsDocsPage} key="DataUnions" />,
    // SDKs Routes
    <Route exact path={docs.SDKs.root} component={SDKsDocsPage} key="SDKsPage" />,
    // Running Node routes
    // <Route exact path={docs.runningNode} component={RunningNodeDocsPage} key="RunningNodePage" />,
    // API routes
    <Route exact path={docs.api.apiOverview} component={ApiOverviewDocsPage} key="ApiOverview" />,
    <Redirect exact from={docs.api.root} to={docs.api.apiOverview} key="ApiOverview" />,
    <Route exact path={docs.api.authentication} component={AuthenticationDocsPage} key="Authentication" />,
    <Route exact path={docs.api.usingStreamsViaApi} component={UsingStreamsViaApiDocsPage} key="usingStreamsViaApi" />,
    <Route exact path={docs.api.apiExplorer} component={ApiExplorerDocsPage} key="apiExplorer" />,
    // Technical Notes routes
    <Route exact path={docs.technicalNotes.root} component={TechnicalNotesDocsPage} key="technicalNotes" />,
    // Docs Root
    <Redirect exact from={docs.main} to={docs.introduction} key="DocsRoot" />,
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
    <Route exact path={routes.editProduct()} component={EditProductAuth2} key="EditProduct" />,
    ...(process.env.DATA_UNIONS ? [
        <Route exact path={routes.productStats()} component={StatsPageAuth} key="StatsPage" />,
        <Route exact path={routes.productMembers()} component={MembersPageAuth} key="MembersPage" />,
    ] : []),
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
            <ModalPortalProvider>
                <ModalProvider>
                    <LocaleSetter />
                    <AutoScroll />
                    <Analytics />
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
                </ModalProvider>
            </ModalPortalProvider>
        </SessionProvider>
    </ConnectedRouter>
)

export default App
