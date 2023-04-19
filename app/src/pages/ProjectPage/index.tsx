import React from 'react'
import { Redirect, Route, Switch, useParams } from 'react-router-dom'
import { ProjectDraftContext, useInitProject } from '$shared/stores/projectEditor'
import routes from '$routes'
import TabbedPage from './TabbedPage'

function NewProjectPage(): JSX.Element {
    throw new Error('Not implemented.')
}

function EditProjectPage(): JSX.Element {
    throw new Error('Not implemented.')
}

function ProjectRedirect() {
    const { id } = useParams<{ id: string }>()

    return <Redirect to={routes.projects.overview({ id })} />
}

export default function ProjectPage() {
    const { id: projectId = 'new' } = useParams<{ id: string }>()

    return (
        <ProjectDraftContext.Provider
            value={useInitProject(
                projectId === 'new' ? undefined : decodeURIComponent(projectId),
            )}
        >
            <Switch>
                <Route
                    exact
                    path={routes.projects.new()}
                    component={NewProjectPage}
                    key="NewProjectPage"
                />
                <Route
                    exact
                    path={routes.projects.show()}
                    component={ProjectRedirect}
                    key="ProjectRedirect"
                />
                <Route
                    exact
                    path={routes.projects.edit()}
                    component={EditProjectPage}
                    key="EditProjectPage"
                />
                <Route
                    exact
                    path={routes.projects.showTab()}
                    component={TabbedPage}
                    key="TabbedPage"
                />
            </Switch>
        </ProjectDraftContext.Provider>
    )
}
