import '@ibm/plex/css/ibm-plex.css'
import { NavProvider } from '@streamr/streamr-layout'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { Container } from 'toasterhea'
import '~/analytics'
import { HubRouter } from '~/consts'
import GenericErrorPage from '~/pages/GenericErrorPage'
import { NetworkOverviewPage } from '~/pages/NetworkOverviewPage'
import NotFoundPage from '~/pages/NotFoundPage'
import { OperatorsPage } from '~/pages/OperatorsPage'
import ProjectListingPage from '~/pages/ProjectListingPage'
import {
    ExistingProjectPageWrap,
    NewProjectPage,
    ProjectConnectPage,
    ProjectDraftPage,
    ProjectIndexRedirect,
    ProjectLiveDataPage,
    ProjectOverviewPage,
    ProjectTabbedPage,
} from '~/pages/ProjectPage'
import { SingleOperatorPage } from '~/pages/SingleOperatorPage'
import { SingleSponsorshipPage } from '~/pages/SingleSponsorshipPage'
import { SponsorshipsPage } from '~/pages/SponsorshipsPage'
import { StreamsPage } from '~/pages/StreamsPage'
import {
    StreamConnectPage,
    StreamDraftPage,
    StreamEditPage,
    StreamIndexRedirect,
    StreamLiveDataPage,
    StreamTabbedPage,
} from '~/pages/StreamPage'
import routes from '~/routes'
import '~/shared/assets/stylesheets'
import Globals from '~/shared/components/Globals'
import StreamrClientProvider from '~/shared/components/StreamrClientProvider'
import { Provider as ModalProvider } from '~/shared/contexts/ModalApi'
import { Provider as ModalPortalProvider } from '~/shared/contexts/ModalPortal'
import Analytics from '~/shared/utils/Analytics'
import { getQueryClient } from '~/utils'
import { Layer } from '~/utils/Layer'
import '~/utils/setupSnippets'
import ProjectEditorPage from './pages/ProjectPage/ProjectEditorPage'

const App = () => (
    <Root>
        <Analytics />
        <Globals />
        <Routes>
            <Route errorElement={<GenericErrorPage />}>
                <Route path="/hub/projects">
                    <Route index element={<ProjectListingPage />} />
                    <Route element={<ProjectDraftPage />}>
                        <Route path="new" element={<NewProjectPage />} />
                        <Route path=":id" element={<ExistingProjectPageWrap />}>
                            <Route index element={<ProjectIndexRedirect />} />
                            <Route path="edit" element={<ProjectEditorPage />} />
                            <Route element={<ProjectTabbedPage />}>
                                <Route
                                    path="overview"
                                    element={<ProjectOverviewPage />}
                                />
                                <Route path="connect" element={<ProjectConnectPage />} />
                                <Route
                                    path="live-data"
                                    element={<ProjectLiveDataPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="/hub/streams">
                    <Route index element={<StreamsPage />} />
                    <Route element={<StreamDraftPage />}>
                        <Route
                            path="new"
                            element={
                                <StreamTabbedPage stickySubmit>
                                    {(attach, ready) =>
                                        ready ? (
                                            <StreamEditPage saveButtonRef={attach} />
                                        ) : null
                                    }
                                </StreamTabbedPage>
                            }
                        />
                        <Route path=":id">
                            <Route index element={<StreamIndexRedirect />} />
                            <Route
                                path="overview"
                                element={
                                    <StreamTabbedPage stickySubmit>
                                        {(attach, ready) =>
                                            ready ? (
                                                <StreamEditPage saveButtonRef={attach} />
                                            ) : null
                                        }
                                    </StreamTabbedPage>
                                }
                            />
                            <Route element={<StreamTabbedPage />}>
                                <Route path="connect" element={<StreamConnectPage />} />
                                <Route
                                    path="live-data"
                                    element={<StreamLiveDataPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="/hub/network">
                    <Route
                        index
                        element={<Navigate to={routes.network.sponsorships()} replace />}
                    />
                    <Route path="operators">
                        <Route index element={<OperatorsPage />} />
                        <Route path=":id" element={<SingleOperatorPage />} />
                    </Route>
                    <Route path="sponsorships">
                        <Route index element={<SponsorshipsPage />} />
                        <Route path=":id" element={<SingleSponsorshipPage />} />
                    </Route>
                    <Route path="overview" element={<NetworkOverviewPage />} />
                </Route>
                <Route
                    path={routes.root()}
                    element={<Navigate to={routes.projects.index()} replace />}
                />
                <Route
                    path={routes.hub()}
                    element={<Navigate to={routes.projects.index()} replace />}
                />
                <Route path="/error" element={<GenericErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />,
            </Route>
        </Routes>
        <ModalContainer id={Layer.Modal} />
        <ToastContainer id={Layer.Toast} />
    </Root>
)

export default App

const ModalContainer = styled(Container)`
    position: relative;
    z-index: 11;
`

const ToastContainer = styled(Container)`
    bottom: 0;
    left: 0;
    max-width: 100%;
    padding-bottom: 24px;
    padding-right: 24px;
    position: fixed;
    z-index: 12;
`

function Root({ children }: { children: ReactNode }) {
    return (
        <HubRouter>
            <QueryClientProvider client={getQueryClient()}>
                <NavProvider>
                    <StreamrClientProvider>
                        <ModalPortalProvider>
                            <ModalProvider>{children}</ModalProvider>
                        </ModalPortalProvider>
                    </StreamrClientProvider>
                </NavProvider>
            </QueryClientProvider>
        </HubRouter>
    )
}
