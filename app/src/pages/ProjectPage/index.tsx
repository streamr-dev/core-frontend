import React from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ProjectDraftContext, useInitProject } from '$shared/stores/projectEditor'
import NotFoundPage from '$shared/components/NotFoundPage'
import routes from '$routes'
import TabbedPage from './TabbedPage'
import ProjectEditorPage from './ProjectEditorPage'

function NewProjectPage(): JSX.Element {
    throw new Error('Not implemented.')
}

function ProjectRedirect() {
    const { id } = useParams<{ id: string }>()

    return <Navigate to={routes.projects.overview({ id })} replace />
}

export default function ProjectPage() {
    const { id: projectId = 'new' } = useParams<{ id: string }>()

    return (
        <ProjectDraftContext.Provider
            value={useInitProject(
                projectId === 'new' ? undefined : decodeURIComponent(projectId),
            )}
        >
            <Routes>
                <Route
                    path={routes.projects.new()}
                    element={<NewProjectPage />}
                    key="NewProjectPage"
                />
                <Route
                    path={routes.projects.edit()}
                    element={<ProjectEditorPage />}
                    key="EditProjectPage"
                />
                <Route index element={<ProjectRedirect />} key="ProjectRedirect" />
                <Route path="overview" element={<TabbedPage tab="overview" />} />
                <Route path="connect" element={<TabbedPage tab="connect" />} />
                <Route path="live-data" element={<TabbedPage tab="live-data" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ProjectDraftContext.Provider>
    )
}
