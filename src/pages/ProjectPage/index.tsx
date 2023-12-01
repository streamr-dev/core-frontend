import React from 'react'
import {
    Navigate,
    Route,
    Routes,
    useMatch,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import {
    ProjectDraftContext,
    preselectSalePoint,
    useInitProjectDraft,
} from '~/stores/projectDraft'
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
    /**
     * This component is meant to be attached to `/hub/projects/*` wildcard
     * route. In such context there's no `:id` param available through
     * `useParams` hook. We have to parse it manually using `useMatch`.
     */
    const { id = 'new' } = useMatch('/hub/projects/:id/*')?.params || {}

    const projectId = decodeURIComponent(id)

    const type = useSearchParams()[0].get('type')

    const projectType = isProjectType(type) ? type : ProjectType.OpenData

    return (
        <ProjectDraftContext.Provider
            value={useInitProjectDraft(
                projectId === 'new' ? void 0 : projectId,
                (projectId, _, draft) => {
                    if (projectId) {
                        /**
                         * Further steps are for new projects only. Skip.
                         */
                        return
                    }

                    const { cold, hot } = draft.entity

                    cold.type = projectType

                    preselectSalePoint(cold)

                    hot.type = projectType

                    preselectSalePoint(hot)
                },
            )}
        >
            <Routes>
                <Route path="/new" element={<ProjectEditorPage />} />
                <Route path="/:id/*">
                    <Route index element={<ProjectRedirect />} />
                    <Route path="edit" element={<ProjectEditorPage />} />
                    <Route path="overview" element={<TabbedPage tab="overview" />} />
                    <Route path="connect" element={<TabbedPage tab="connect" />} />
                    <Route path="live-data" element={<TabbedPage tab="live-data" />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </ProjectDraftContext.Provider>
    )
}
