import React, { ReactNode } from 'react'
import { Project } from '~/marketplace/types/project-types'
import { getProjectTypeTitle } from '~/getters'

export const getProjectTitleForEditor = (project: Project): ReactNode => {
    return (
        !!project.creator && (
            <>
                {getProjectTypeTitle(project.type)} by
                <strong>&nbsp;{project.creator} </strong>
            </>
        )
    )
}
