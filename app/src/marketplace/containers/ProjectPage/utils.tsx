import React, { ReactNode } from 'react'
import { Project } from '$mp/types/project-types'
import { getProjectTypeTitle } from '$app/src/getters'

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
