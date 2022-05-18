// @flow

import React from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'

import links from '$shared/../docsLinks'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import GenericErrorPage from '$shared/components/GenericErrorPage'

// Docs Pages
import Welcome from '$docs/components/Pages/Welcome'
// Learn Docs
import Learn from '$docs/components/Pages/Learn/Overview'
import Identity from '$docs/components/Pages/Learn/Identity'
import UseCases from '$docs/components/Pages/Learn/UseCases'
import Tokenomics from '$docs/components/Pages/Learn/Tokenomics'
import NetworkExplorer from '$docs/components/Pages/Learn/NetworkExplorer'
import Glossary from '$docs/components/Pages/Learn/Glossary'
import HowToContribute from '$docs/components/Pages/Learn/HowToContribute'
// Streamr nodes Docs
import IntroToStreamrNetwork from '$docs/components/Pages/StreamrNetwork/IntroToStreamrNetwork'
import UsingALightNode from '$docs/components/Pages/StreamrNetwork/UsingALightNode'
import InstallingABrokerNode from '$docs/components/Pages/StreamrNetwork/InstallingABrokerNode'
import UpdatingABrokerNode from '$docs/components/Pages/StreamrNetwork/UpdatingABrokerNode'
import ConnectingApplications from '$docs/components/Pages/StreamrNetwork/ConnectingApplications'
import Mining from '$docs/components/Pages/StreamrNetwork/Mining'
// Streams Docs
import IntroToStreams from '$docs/components/Pages/Streams/IntroToStreams'
import CreatingStreams from '$docs/components/Pages/Streams/CreatingStreams'
import ManagingYourStreams from '$docs/components/Pages/Streams/ManagingYourStreams'
import PublishAndSubscribe from '$docs/components/Pages/Streams/PublishAndSubscribe'
import AccessControl from '$docs/components/Pages/Streams/AccessControl'
import Storage from '$docs/components/Pages/Streams/Storage'
import EndToEndEncryption from '$docs/components/Pages/Streams/EndToEndEncryption'
import DataSigningAndVerification from '$docs/components/Pages/Streams/DataSigningAndVerification'
import Partitioning from '$docs/components/Pages/Streams/Partitioning'
// Marketplace Docs
import IntroToMarketplace from '$docs/components/Pages/Marketplace/IntroToMarketplace'
import CreatingDataProducts from '$docs/components/Pages/Marketplace/CreatingDataProducts'
// Data Unions Docs
import IntroToDataUnions from '$docs/components/Pages/DataUnions/IntroToDataUnions'
import CreatingADataUnion from '$docs/components/Pages/DataUnions/CreatingADataUnion'
import RolesAndResponsibilities from '$docs/components/Pages/DataUnions/RolesAndResponsibilities'
import WalletManagement from '$docs/components/Pages/DataUnions/WalletManagement'
import JoiningAndPartingMembers from '$docs/components/Pages/DataUnions/JoiningAndPartingMembers'
import WithdrawingEarnings from '$docs/components/Pages/DataUnions/WithdrawingEarnings'
import UXBestPractices from '$docs/components/Pages/DataUnions/UXBestPractices'

const Route = withErrorBoundary(GenericErrorPage)(RouterRoute)

const DocsRouter = () => ([
    // // Welcome routes
    <Route exact path={links.welcome} component={Welcome} key="WelcomePage" />,
    <Redirect exact from={links.docs} to={links.welcome} key="landingPage" />,
    // Learn routes
    <Route exact path={links.overview} component={Learn} key="LearnPageRoot" />,
    <Redirect exact from={links.learn} to={links.overview} key="LearnPage" />,
    <Route exact path={links.identity} component={Identity} key="IdentityPage" />,
    <Route exact path={links.useCases} component={UseCases} key="UseCasesPage" />,
    <Route exact path={links.tokenomics} component={Tokenomics} key="TokenomicsPage" />,
    <Route exact path={links.networkExplorer} component={NetworkExplorer} key="NetworkExplorerPage" />,
    <Route exact path={links.glossary} component={Glossary} key="GlossaryPage" />,
    <Route exact path={links.howToContribute} component={HowToContribute} key="HowToContributePage" />,
    <Redirect exact from={links.dataToken} to={links.tokenomics} key="tokenomicsPage" />,
    // Streamr Network routes
    <Route exact path={links.introToStreamrNetwork} component={IntroToStreamrNetwork} key="IntroToStreamrNetwork" />,
    <Redirect exact from={links.streamrNetwork} to={links.introToStreamrNetwork} key="StreamrNetworkRoot" />,
    <Route exact path={links.usingALightNode} component={UsingALightNode} key="UsingALightNode" />,
    <Route exact path={links.installingABrokerNode} component={InstallingABrokerNode} key="InstallingABrokerNode" />,
    <Route exact path={links.updatingABrokerNode} component={UpdatingABrokerNode} key="UpdatingABrokerNode" />,
    <Route exact path={links.connectingApplications} component={ConnectingApplications} key="connectingApplications" />,
    <Route exact path={links.mining} component={Mining} key="mining" />,
    // Streams routes
    <Route exact path={links.introToStreams} component={IntroToStreams} key="IntroToStreamsPage" />,
    <Redirect exact from={links.streams} to={links.introToStreams} key="StreamsRoot" />,
    <Route exact path={links.creatingStreams} component={CreatingStreams} key="creatingStreams" />,
    <Route exact path={links.managingYourStreams} component={ManagingYourStreams} key="managingYourStreams" />,
    <Route exact path={links.publishAndSubscribe} component={PublishAndSubscribe} key="publishAndSubscribe" />,
    <Route exact path={links.accessControl} component={AccessControl} key="accessControl" />,
    <Route exact path={links.storage} component={Storage} key="storage" />,
    <Route exact path={links.endToEndEncryption} component={EndToEndEncryption} key="EndToEndEncryption" />,
    <Route exact path={links.dataSigningAndVerification} component={DataSigningAndVerification} key="DSAndVerification" />,
    <Route exact path={links.partitioning} component={Partitioning} key="Partitioning" />,
    // Marketplace routes
    <Route exact path={links.introToMarketplace} component={IntroToMarketplace} key="IntroToMarketplace" />,
    <Redirect exact from={links.marketplace} to={links.introToMarketplace} key="MarketplaceRoot" />,
    <Route exact path={links.creatingDataProducts} component={CreatingDataProducts} key="CreatingDataProducts" />,
    // Data union routes
    <Redirect exact from={links.dataUnions} to={links.introToDataUnions} key="DataUnionsRoot" />,
    <Route exact path={links.introToDataUnions} component={IntroToDataUnions} key="DataUnionsIntro" />,
    <Route exact path={links.creatingADataUnion} component={CreatingADataUnion} key="creatingADataUnion" />,
    <Route exact path={links.rolesAndResponsibilities} component={RolesAndResponsibilities} key="RolesAndResponsibilities" />,
    <Route exact path={links.walletManagement} component={WalletManagement} key="walletManagement" />,
    <Route exact path={links.joiningAndPartingMembers} component={JoiningAndPartingMembers} key="joiningAndPartingMembers" />,
    <Route exact path={links.withdrawingEarnings} component={WithdrawingEarnings} key="withdrawingEarnings" />,
    <Route exact path={links.uxBestPractices} component={UXBestPractices} key="UXBestPractices" />,
    // Docs Root/Redirects
    <Redirect exact from={links.gettingStarted} to={links.welcome} key="GettingStartedRedirect" />,
    <Redirect exact from={links.products} to={links.marketplace} key="ProductsRedirect" />,
    <Redirect exact from={links.docs} to={links.welcome} key="DocsRoot" />,
])

export default DocsRouter
