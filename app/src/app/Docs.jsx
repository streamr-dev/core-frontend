// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'

import { docsLinks as links } from '$shared/../links'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import GenericErrorPage from '$shared/components/GenericErrorPage'

// Docs Pages
import Introduction from '$docs/components/DocsPages/Introduction'
// Getting Started Docs
import GettingStarted from '$docs/components/DocsPages/GettingStarted'
// Streams Docs
import IntroToStreams from '$docs/components/DocsPages/Streams/IntroToStreams'
import UsingStreamsInCore from '$docs/components/DocsPages/Streams/UsingStreamsInCore'
import UsingStreamsViaApi from '$docs/components/DocsPages/Streams/UsingStreamsViaApi'
import UsingStreamsViaSdk from '$docs/components/DocsPages/Streams/UsingStreamsViaSdk'
import Partitioning from '$docs/components/DocsPages/Streams/Partitioning'
import IntegrationPatterns from '$docs/components/DocsPages/Streams/IntegrationPatterns'
import EndToEndEncryption from '$docs/components/DocsPages/Streams/EndToEndEncryption'
import DataSigningAndVerification from '$docs/components/DocsPages/Streams/DataSigningAndVerification'
// Canvases Docs
import IntroToCanvases from '$docs/components/DocsPages/Canvases/IntroToCanvases'
import ModulesBasics from '$docs/components/DocsPages/Canvases/ModulesBasics'
import ModulesAdvanced from '$docs/components/DocsPages/Canvases/ModulesAdvanced'
// Module Reference Docs
import ModuleReferenceHelp from '$docs/components/DocsPages/ModuleReference/HelpModules'
// Dashboard Docs
import Dashboards from '$docs/components/DocsPages/Dashboards'
// Products Docs
import IntroToProducts from '$docs/components/DocsPages/Products/IntroToProducts'
import DataUnions from '$docs/components/DocsPages/Products/DataUnions'
// Data Unions Docs
import IntroToDataUnions from '$docs/components/DocsPages/DataUnions/IntroToDataUnions'
import DataUnionsInCore from '$docs/components/DocsPages/DataUnions/DataUnionsInCore'
import DataUnionsIntegration from '$docs/components/DocsPages/DataUnions/DataUnionsIntegration'
import DataUnionsInSdk from '$docs/components/DocsPages/DataUnions/DataUnionsInSdk'
// Tutorials Docs
import BuildingPubSub from '$docs/components/DocsPages/Tutorials/BuildingPubSub'
import BuildingCustomModule from '$docs/components/DocsPages/Tutorials/BuildingCustomModule'
// DATA Token Docs
import DataToken from '$docs/components/DocsPages/DataToken'
// Core Docs
import IntroToCore from '$docs/components/DocsPages/Core/IntroToCore'
import UsingCanvasesInCore from '$docs/components/DocsPages/Core/UsingCanvasesInCore'
// Marketplace Docs
import IntroToMarketplace from '$docs/components/DocsPages/Marketplace/IntroToMarketplace'
// SDK Docs
import Sdk from '$docs/components/DocsPages/Sdk/Overview'
import JavascriptSdk from '$docs/components/DocsPages/Sdk/Javascript'
import JavaSdk from '$docs/components/DocsPages/Sdk/Java'
import PythonSdk from '$docs/components/DocsPages/Sdk/Python'
// ****
// API Docs
import ApiOverview from '$docs/components/DocsPages/Api/Overview'
import Authentication from '$docs/components/DocsPages/Api/Authentication'
import ApiExplorer from '$docs/components/DocsPages/ApiExplorer'
// Technical Notes Docs
import TechnicalNotes from '$docs/components/DocsPages/TechnicalNotes'

const Route = withErrorBoundary(GenericErrorPage)(RouterRoute)

const DocsRouter = () => ([
    // // Introduction routes
    <Route exact path={links.introduction} component={Introduction} key="IntroductionPage" />,
    // Getting Started routes
    <Route exact path={links.gettingStarted} component={GettingStarted} key="GettingStartedPage" />,
    // Streams routes
    <Route exact path={links.introToStreams} component={IntroToStreams} key="IntroToStreamsPage" />,
    <Redirect exact from={links.streams} to={links.introToStreams} key="StreamsRoot" />,
    <Route exact path={links.streamsInCore} component={UsingStreamsInCore} key="UsingStreamsInCore" />,
    <Route exact path={links.streamsViaApi} component={UsingStreamsViaApi} key="UsingStreamsViaApi" />,
    <Route exact path={links.streamsViaSdk} component={UsingStreamsViaSdk} key="UsingStreamsViaSdk" />,
    <Route exact path={links.partitioning} component={Partitioning} key="Partitioning" />,
    <Route exact path={links.integrationPatterns} component={IntegrationPatterns} key="IntegrationPatterns" />,
    <Route exact path={links.endToEndEncryption} component={EndToEndEncryption} key="EndToEndEncryption" />,
    <Route exact path={links.dataSigningAndVerification} component={DataSigningAndVerification} key="DSAndVerification" />,
    // Canvases routes
    <Route exact path={links.introToCanvases} component={IntroToCanvases} key="IntroToCanvases" />,
    <Redirect exact from={links.canvases} to={links.introToCanvases} key="CanvasesRoot" />,
    <Route exact path={links.usingCanvases} component={UsingCanvasesInCore} key="UsingCanvases" />,
    <Route exact path={links.modulesBasics} component={ModulesBasics} key="ModulesBasics" />,
    <Route exact path={links.modulesAdvanced} component={ModulesAdvanced} key="ModulesAdvanced" />,
    // Dashboard routes
    <Route exact path={links.dashboards} component={Dashboards} key="DashboardsPage" />,
    // Products routes
    <Route exact path={links.introToProducts} component={IntroToProducts} key="IntroToProducts" />,
    <Redirect exact from={links.products} to={links.introToProducts} key="ProductsRoot" />,
    <Route exact path={links.productsDataunions} component={DataUnions} key="DataUnions" />,
    // Data Unions
    ...(process.env.DATA_UNIONS_DOCS ? [
        <Route exact path={links.introToDataUnions} component={IntroToDataUnions} key="DataUnionsIntro" />,
        <Redirect exact from={links.dataUnions} to={links.introToDataUnions} key="DataUnionsRoot" />,
        <Route exact path={links.dataUnionsInCore} component={DataUnionsInCore} key="DataUnionsInCore" />,
        <Route exact path={links.integrateDataUnions} component={DataUnionsIntegration} key="DataUnionsIntegration" />,
        <Route exact path={links.dataUnionsWithSdk} component={DataUnionsInSdk} key="DataUnionsInSdk" />,
    ] : []),
    // Module Reference routes
    <Route
        exact
        path={links.moduleReferenceBoolean}
        render={() => (<ModuleReferenceHelp category="Boolean" pageTitle="Boolean Modules" />)}
        key="BooleanDocsPage"
    />,
    <Redirect exact from={links.moduleReference} to={links.moduleReferenceBoolean} key="ModuleReferencePage" />,
    <Route
        exact
        path={links.moduleReferenceCustomModules}
        render={() => (<ModuleReferenceHelp category="Custom Modules" pageTitle="Custom Modules" />)}
        key="CMDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceInput}
        render={() => (<ModuleReferenceHelp category="Input" pageTitle="Input Modules" />)}
        key="InputDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceIntegrations}
        render={() => (<ModuleReferenceHelp category="Integrations" pageTitle="Integration Modules" />)}
        key="IntegrationsDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceList}
        render={() => (<ModuleReferenceHelp category="List" pageTitle="List Modules" />)}
        key="ListDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceMap}
        render={() => (<ModuleReferenceHelp category="Map" pageTitle="Map Modules" />)}
        key="MapDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceStreams}
        render={() => (<ModuleReferenceHelp category="Streams" pageTitle="Stream Modules" />)}
        key="StreamsDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceText}
        render={() => (<ModuleReferenceHelp category="Text" pageTitle="Text Modules" />)}
        key="TextDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceTimeAndDate}
        render={() => (<ModuleReferenceHelp category="Time & Date" pageTitle="Time & Date Modules" />)}
        key="TimeAndDateDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceTimeSeries}
        render={() => (<ModuleReferenceHelp category="Time Series" pageTitle="Time Series Modules" />)}
        key="TimeSeriesDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceUtils}
        render={() => (<ModuleReferenceHelp category="Utils" pageTitle="Utils Modules" />)}
        key="UtilsDocsPage"
    />,
    <Route
        exact
        path={links.moduleReferenceVisualizations}
        render={() => (<ModuleReferenceHelp category="Visualizations" pageTitle="Visualization Modules" />)}
        key="VisualizationsDocsPage"
    />,
    // Tutorials routes
    <Route exact path={links.buildingPubSubTutorial} component={BuildingPubSub} key="BuildingPubSub" />,
    <Redirect exact from={links.tutorials} to={links.buildingPubSubTutorial} key="TutorialsRoot" />,
    <Route exact path={links.customModuleTutorial} component={BuildingCustomModule} key="BuildingCustomModule" />,
    // DATA Token routes
    <Route exact path={links.dataToken} component={DataToken} key="DataTokenPage" />,
    // Core routes
    <Route exact path={links.introToCore} component={IntroToCore} key="IntroToCore" />,
    <Redirect exact from={links.core} to={links.introToCore} key="CoreRoot" />,
    // Marketplace routes
    <Route exact path={links.introToMarketplace} component={IntroToMarketplace} key="IntroToMarketplace" />,
    <Redirect exact from={links.marketplace} to={links.introToMarketplace} key="MarketplaceRoot" />,
    <Route exact path={links.marketplaceDataunions} component={DataUnions} key="DataUnions" />,
    // SDK Routes
    <Route exact path={links.sdkOverview} component={Sdk} key="SdkOverviewPage" />,
    <Redirect exact from={links.sdk} to={links.sdkOverview} key="SdkRoot" />,
    <Route exact path={links.javascriptSdk} component={JavascriptSdk} key="JavascriptSdkPage" />,
    <Route exact path={links.javaSdk} component={JavaSdk} key="JavaSdkPage" />,
    <Route exact path={links.pythonSdk} component={PythonSdk} key="PythonSdk" />,
    // API routes
    <Route exact path={links.apiOverview} component={ApiOverview} key="ApiOverview" />,
    <Redirect exact from={links.api} to={links.apiOverview} key="ApiOverview" />,
    <Route exact path={links.authentication} component={Authentication} key="Authentication" />,
    <Route exact path={links.apiStreamsViaApi} component={UsingStreamsViaApi} key="usingStreamsViaApi" />,
    <Route exact path={links.apiExplorer} component={ApiExplorer} key="apiExplorer" />,
    // Technical Notes routes
    <Route exact path={links.technicalNotes} component={TechnicalNotes} key="technicalNotes" />,
    // Docs Root
    <Redirect exact from={links.docs} to={links.introduction} key="DocsRoot" />,
])

export default DocsRouter
