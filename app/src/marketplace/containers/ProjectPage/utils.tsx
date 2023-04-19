import React, { ReactNode } from 'react'
import styled from "styled-components"
import { Project } from '$mp/types/project-types'
import { mapProjectTypeName } from "$mp/utils/project-mapper"

const ProjectTitlePart = styled.strong`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const getProjectTitle = (project: Project): ReactNode => {
    return (
        <>
            <ProjectTitlePart as={'span'}>{project.name}</ProjectTitlePart>
            {!!project.creator && (
                <>
                    &nbsp;by&nbsp;<ProjectTitlePart>{project.creator}</ProjectTitlePart>
                </>
            )}
        </>
    )
}

export const getProjectTitleForEditor = (project: Project): ReactNode => {
    return (
        !!project.creator && (
            <>
                {mapProjectTypeName(project.type)} by
                <strong>&nbsp;{project.creator} </strong>
            </>
        )
    )
}
