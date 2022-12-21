import React, { createContext, FunctionComponent, ReactNode } from 'react'
import { StateContainerProps, useStateContainer } from '$shared/hooks/useStateContainer'
import { EmptyProject } from '../utils/empty-project'
import { Project } from '../types/project-types'

export const ProjectStateContext = createContext<StateContainerProps<Project>>(null)

export const ProjectStateContextProvider: FunctionComponent<{children: ReactNode | ReactNode[] }> = ({children}) => {
    return <ProjectStateContext.Provider value={useStateContainer<Project>(new EmptyProject())}>
        {children}
    </ProjectStateContext.Provider>
}
