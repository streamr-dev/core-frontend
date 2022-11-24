import React, { ReactNode } from 'react'
import { Project } from '$mp/types/project-types'
import { LinkTabOptionProps } from '$shared/components/LinkTabs'
import routes from '$routes'

export const getProjectTitle = (project: Project): ReactNode => {
    return <>{project.name} by <strong>{project.owner}</strong></>
}

export const getProjectDetailsLinkTabs = (projectId: string): LinkTabOptionProps[] => {
    return [
        {
            label: 'Project overview',
            href:  routes.marketplace.product.overview({id: projectId})
        },
        {
            label: 'Connect',
            href:  routes.marketplace.product.connect({id: projectId})
        },
        {
            label: 'Live data',
            href:  routes.marketplace.product.liveData({id: projectId})
        }
    ]
}
