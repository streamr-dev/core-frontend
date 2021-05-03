// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import GenericErrorPage from '$shared/components/GenericErrorPage'

// Docs Pages
import Introduction from '$docs/components/Pages/Introduction'
// Getting Started Docs
import GettingStarted from '$docs/components/Pages/GettingStarted'
// Streams Docs
import IntroToStreams from '$docs/components/Pages/Streams/IntroToStreams'
import UsingStreamsInCore from '$docs/components/Pages/Streams/UsingStreamsInCore'
import UsingStreamsViaApi from '$docs/components/Pages/Streams/UsingStreamsViaApi'
import UsingStreamsViaSdk from '$docs/components/Pages/Streams/UsingStreamsViaSdk'
import Partitioning from '$docs/components/Pages/Streams/Partitioning'
import IntegrationPatterns from '$docs/components/Pages/Streams/IntegrationPatterns'
import EndToEndEncryption from '$docs/components/Pages/Streams/EndToEndEncryption'
import DataSigningAndVerification from '$docs/components/Pages/Streams/DataSigningAndVerification'
// Data Products Docs
import CreateProduct from '$docs/components/Pages/Products/CreateProduct'
// Data Unions Docs
import IntroToDataUnions from '$docs/components/Pages/DataUnions/IntroToDataUnions'
import DataUnionsCore from '$docs/components/Pages/DataUnions/DataUnionsCore'
import FrameworkRoles from '$docs/components/Pages/DataUnions/FrameworkRoles'
import AuthAndIdentity from '$docs/components/Pages/DataUnions/AuthAndIdentity'
import CreateAndMonitor from '$docs/components/Pages/DataUnions/CreateAndMonitor'
import JoinAndWithdraw from '$docs/components/Pages/DataUnions/JoinAndWithdraw'
import UXBestPractices from '$docs/components/Pages/DataUnions/UXBestPractices'
// Tutorials Docs
import BuildingPubSub from '$docs/components/Pages/Tutorials/BuildingPubSub'
// DATA Token Docs
import DataToken from '$docs/components/Pages/DataToken'
// Core Docs
import IntroToCore from '$docs/components/Pages/Core/IntroToCore'
import SharingResourcesInCore from '$docs/components/Pages/Core/SharingResourcesInCore'
// Marketplace Docs
import IntroToMarketplace from '$docs/components/Pages/Marketplace/IntroToMarketplace'
// SDK Docs
import Sdk from '$docs/components/Pages/Sdk/Overview'
import JavascriptSdk from '$docs/components/Pages/Sdk/Javascript'
import JavaSdk from '$docs/components/Pages/Sdk/Java'
import PythonSdk from '$docs/components/Pages/Sdk/Python'
// ****
// API Docs
import ApiOverview from '$docs/components/Pages/Api/Overview'
import Authentication from '$docs/components/Pages/Api/Authentication'
import ApiExplorer from '$docs/components/Pages/ApiExplorer'
// Technical Notes Docs
import TechnicalNotes from '$docs/components/Pages/TechnicalNotes'
import links from '$shared/../docsLinks'

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
    // Data Products routes
    <Route exact path={links.createProduct} component={CreateProduct} key="CreateProduct" />,
    <Redirect exact from={links.products} to={links.createProduct} key="ProductsRoot" />,
    // Data union routes
    <Redirect exact from={links.dataUnions} to={links.introToDataUnions} key="DataUnionsRoot" />,
    <Route exact path={links.introToDataUnions} component={IntroToDataUnions} key="DataUnionsIntro" />,
    <Route exact path={links.dataUnionsInCore} component={DataUnionsCore} key="DataUnionsInCore" />,
    <Route exact path={links.frameworkRoles} component={FrameworkRoles} key="FrameworkRoles" />,
    <Route exact path={links.authAndIdentity} component={AuthAndIdentity} key="AuthAndIdentity" />,
    <Route exact path={links.createAndMonitor} component={CreateAndMonitor} key="CreateAndMonitor" />,
    <Route exact path={links.joinAndWithdraw} component={JoinAndWithdraw} key="JoinAndWithdraw" />,
    <Route exact path={links.uxBestPractices} component={UXBestPractices} key="UXBestPractices" />,
    // Tutorials routes
    <Route exact path={links.buildingPubSubTutorial} component={BuildingPubSub} key="BuildingPubSub" />,
    <Redirect exact from={links.tutorials} to={links.buildingPubSubTutorial} key="TutorialsRoot" />,
    // DATA Token routes
    <Route exact path={links.dataToken} component={DataToken} key="DataTokenPage" />,
    // Core routes
    <Route exact path={links.introToCore} component={IntroToCore} key="IntroToCore" />,
    <Redirect exact from={links.core} to={links.introToCore} key="CoreRoot" />,
    <Route exact path={links.sharingResourcesInCore} component={SharingResourcesInCore} key="SharingResourcesInCore" />,
    // Marketplace routes
    <Route exact path={links.introToMarketplace} component={IntroToMarketplace} key="IntroToMarketplace" />,
    <Redirect exact from={links.marketplace} to={links.introToMarketplace} key="MarketplaceRoot" />,
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
    // API Explorer
    <Route exact path={links.apiExplorer} component={ApiExplorer} key="apiExplorer" />,
    // Technical Notes routes
    <Route exact path={links.technicalNotes} component={TechnicalNotes} key="technicalNotes" />,
    // Docs Root
    <Redirect exact from={links.docs} to={links.introduction} key="DocsRoot" />,
])

export default DocsRouter
