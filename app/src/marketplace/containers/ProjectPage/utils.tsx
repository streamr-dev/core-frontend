import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Project } from '$mp/types/project-types'
import Tabs, { Tab } from '$shared/components/Tabs'
import routes from '$routes'

export const getProjectTitle = (project: Project): ReactNode => {
    return <>{project.name} {!!project.creator && <>by <strong>{project.creator}</strong></>}</>
}

export function ProjectLinkTabs({ projectId }: { projectId: string | undefined }) {
    const { pathname } = useLocation()

    if (!projectId) {
        return <></>
    }

    return (
        <Tabs selectedId={pathname}>
            <Tab id="overview" tag={Link} to={routes.projects.overview({ id: projectId })} selected="to">
                Project overview
            </Tab>
            <Tab id="connect" tag={Link} to={routes.projects.connect({ id: projectId })} selected="to">
                Connect
            </Tab>
            <Tab id="liveData" tag={Link} to={routes.projects.liveData({ id: projectId })} selected="to">
                Live data
            </Tab>
        </Tabs>
    )
}
