import React, { createContext, FunctionComponent, ReactNode, useMemo } from 'react'
import { StateContainerProps, useStateContainer } from '$shared/hooks/useStateContainer'
import { EmptyProject } from '../utils/empty-project'
import { Project } from '../types/project-types'

export const ProjectStateContext = createContext<StateContainerProps<Project>>(null)

export const ProjectStateContextProvider: FunctionComponent<{children: ReactNode | ReactNode[] }> = ({children}) => {
    const defaultState = useMemo(() => new EmptyProject(), [])
    return <ProjectStateContext.Provider value={useStateContainer<Project>(defaultState)}>
        {children}
    </ProjectStateContext.Provider>
}
