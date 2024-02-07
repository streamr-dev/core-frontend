import React from 'react'
import {
    Navigate,
    Outlet,
    Route,
    Routes,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import { ProjectDraftContext, useInitProjectDraft } from '~/stores/projectDraft'
import NotFoundPage from '~/pages/NotFoundPage'
import routes from '~/routes'
import { isProjectType } from '~/utils'
import { ProjectType } from '~/shared/types'
import TabbedPage from './TabbedPage'
import ProjectEditorPage from './ProjectEditorPage'

function ProjectRedirect() {
    const { id = '' } = useParams<{ id: string }>()

    return (
        <Navigate
            to={routes.projects.overview({
                id: encodeURIComponent(id),
            })}
            replace
        />
    )
}

export default function ProjectPage() {
    return (
        <Routes>
            <Route path="/new" element={<NewProjectPage />} />
            <Route path="/:id" element={<ExistingProjectPageWrap />}>
                <Route index element={<ProjectRedirect />} />
                <Route path="edit" element={<ProjectEditorPage />} />
                <Route path="overview" element={<TabbedPage tab="overview" />} />
                <Route path="connect" element={<TabbedPage tab="connect" />} />
                <Route path="live-data" element={<TabbedPage tab="live-data" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

function useInitNewProjectDraft(_: ProjectType) {
    return ''
}

function NewProjectPage() {
    const type = useSearchParams()[0].get('type')

    const projectType = isProjectType(type) ? type : ProjectType.OpenData

    const draftId = useInitNewProjectDraft(projectType)

    return (
        <ProjectDraftContext.Provider value={draftId}>
            <ProjectEditorPage />
        </ProjectDraftContext.Provider>
    )
}

function ExistingProjectPageWrap() {
    const { id: projectId } = useParams<{ id: string }>()

    const draftId = useInitProjectDraft(projectId)

    return (
        <ProjectDraftContext.Provider value={draftId}>
            <Outlet />
        </ProjectDraftContext.Provider>
    )
}
