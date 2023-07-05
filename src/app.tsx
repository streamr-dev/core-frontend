import React from 'react'
import { Container } from 'toasterhea'
import styled from 'styled-components'
import { Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import '~/shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'
import '~/utils/setupSnippets'
import StreamrClientProvider from '~/shared/components/StreamrClientProvider'
import { Provider as ModalPortalProvider } from '~/shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '~/shared/contexts/ModalApi'
import NotFoundPage from '~/shared/components/NotFoundPage'
import AnalyticsTracker from '~/shared/components/AnalyticsTracker'
import GenericErrorPage from '~/shared/components/GenericErrorPage'
import ErrorPage from '~/shared/components/ErrorPage'
import Analytics from '~/shared/utils/Analytics'
import NewStreamListingPage from '~/pages/NewStreamListingPage'
import StreamPage from '~/pages/StreamPage'
import ProjectPage from '~/pages/ProjectPage'
import ProjectsPage from '~/marketplace/containers/Projects'
import NewProjectPage from '~/marketplace/containers/ProjectEditing/NewProjectPage'
import EditProjectPage from '~/marketplace/containers/ProjectEditing/EditProjectPage'
import { NetworkOverviewPage } from '~/network/pages/NetworkOverviewPage'
import { SponsorshipsPage } from '~/network/pages/SponsorshipsPage'
import Globals from '~/shared/components/Globals'
import { Layer } from '~/utils/Layer'
import { FeatureFlag, isFeatureEnabled } from '~/shared/utils/isFeatureEnabled'
import routes from '~/routes'
import OperatorsPage from '~/pages/OperatorsPage'
import { HubRouter } from '~/consts'
import '~/analytics'

const apolloClient = new ApolloClient({
    uri:
        process.env.GQL_SUBGRAPH_PATH ||
        'http://localhost:8000/subgraphs/name/streamr-dev/network-subgraphs',
    cache: new InMemoryCache(),
})

const MiscRouter = () => [
    <Route
        errorElement={<ErrorPage />}
        path={routes.root()}
        element={<Navigate to={routes.projects.index()} replace />}
        key="RootRedirect"
    />,
    <Route
        errorElement={<ErrorPage />}
        path={routes.hub()}
        element={<Navigate to={routes.projects.index()} replace />}
        key="HubRedirect"
    />,
    <Route
        errorElement={<ErrorPage />}
        path="/error"
        element={<GenericErrorPage />}
        key="GenericErrorPage"
    />,
    <Route errorElement={<ErrorPage />} element={<NotFoundPage />} key="NotFoundPage" />,
]

// Create client for 'react-query'
const queryClient = new QueryClient()

const App = () => (
    <HubRouter>
        <ApolloProvider client={apolloClient}>
            <QueryClientProvider client={queryClient}>
                <StreamrClientProvider>
                    <ModalPortalProvider>
                        <ModalProvider>
                            <Analytics />
                            <Globals />
                            <Routes>
                                <Route
                                    path="/hub/projects/*"
                                    errorElement={<ErrorPage />}
                                >
                                    <Route index element={<ProjectsPage />} />
                                    <Route path="new" element={<NewProjectPage />} />
                                    <Route
                                        path=":id/edit"
                                        element={<EditProjectPage />}
                                    />
                                    <Route path=":id/*" element={<ProjectPage />} />
                                </Route>
                                <Route path="/hub/streams/*" errorElement={<ErrorPage />}>
                                    <Route index element={<NewStreamListingPage />} />
                                    <Route path=":id/*" element={<StreamPage />} />
                                </Route>
                                {isFeatureEnabled(FeatureFlag.PhaseTwo) && (
                                    <>
                                        <Route
                                            path="/hub/network/*"
                                            errorElement={<ErrorPage />}
                                        >
                                            <Route
                                                path="operators/*"
                                                errorElement={<ErrorPage />}
                                            >
                                                <Route
                                                    index
                                                    element={<OperatorsPage />}
                                                />
                                            </Route>
                                            <Route
                                                path="sponsorships/*"
                                                errorElement={<ErrorPage />}
                                            >
                                                <Route
                                                    index
                                                    element={<SponsorshipsPage />}
                                                />
                                            </Route>
                                            <Route
                                                path="overview"
                                                element={<NetworkOverviewPage />}
                                            />
                                        </Route>
                                    </>
                                )}
                                {MiscRouter()}
                            </Routes>
                            <Container id={Layer.Modal} />
                            <ToastContainer id={Layer.Toast} />
                            <AnalyticsTracker />
                        </ModalProvider>
                    </ModalPortalProvider>
                </StreamrClientProvider>
            </QueryClientProvider>
        </ApolloProvider>
    </HubRouter>
)

export default App

const ToastContainer = styled(Container)`
    bottom: 0;
    left: 0;
    max-width: 100%;
    padding-bottom: 24px;
    padding-right: 24px;
    position: fixed;
    z-index: 10;
`
