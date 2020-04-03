// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorPageView from '$mp/components/ErrorPageView'

import links from '../links'

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
// Data Unions Docs
import IntroToDataUnionsDocsPage from '$docs/components/DocsPages/DataUnions/IntroToDataUnions'
import DataUnionsInCoreDocsPage from '$docs/components/DocsPages/DataUnions/DataUnionsInCore'
import DataUnionsIntegrationDocsPage from '$docs/components/DocsPages/DataUnions/DataUnionsIntegration'
import DataUnionsInSDKDocsPage from '$docs/components/DocsPages/DataUnions/DataUnionsInSDK'
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

const Route = withErrorBoundary(ErrorPageView)(RouterRoute)

const { docs } = links

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
    // Data union routes
    ...(process.env.DATA_UNIONS ? [
        <Route exact path={docs.dataUnions.root} component={IntroToDataUnionsDocsPage} key="DataUnionsRoot" />,
        <Route exact path={docs.dataUnions.introToDataUnions} component={IntroToDataUnionsDocsPage} key="DataUnionsIntro" />,
        <Route exact path={docs.dataUnions.dataUnionsInCore} component={DataUnionsInCoreDocsPage} key="DataUnionsInCore" />,
        <Route exact path={docs.dataUnions.integration} component={DataUnionsIntegrationDocsPage} key="DataUnionsIntegration" />,
        <Route exact path={docs.dataUnions.dataUnionsInSDK} component={DataUnionsInSDKDocsPage} key="DataUnionsInSDK" />,
    ] : []),
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
    <Redirect exact from={docs.api.root} to={docs.api.apiOverview} key="ApiOverviewRoot" />,
    <Route exact path={docs.api.authentication} component={AuthenticationDocsPage} key="Authentication" />,
    <Route exact path={docs.api.usingStreamsViaApi} component={UsingStreamsViaApiDocsPage} key="usingStreamsViaApi" />,
    <Route exact path={docs.api.apiExplorer} component={ApiExplorerDocsPage} key="apiExplorer" />,
    // Technical Notes routes
    <Route exact path={docs.technicalNotes.root} component={TechnicalNotesDocsPage} key="technicalNotes" />,
    // Docs Root
    <Redirect exact from={docs.main} to={docs.introduction} key="DocsRoot" />,
])

export default DocsRouter
