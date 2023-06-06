import React, {
    createContext,
    FunctionComponent,
    ReactNode,
    useContext,
    useMemo,
} from 'react'
import { StateContainerProps, useStateContainer } from '$shared/hooks/useStateContainer'
import { EmptyProject } from '../utils/empty-project'
import { Project } from '../types/project-types'

export const ProjectStateContext = createContext<StateContainerProps<Project>>(null)

export const ProjectStateContextProvider: FunctionComponent<{
    children: ReactNode | ReactNode[]
    initState?: Project
}> = ({ children, initState }) => {
    const defaultState = useMemo(() => new EmptyProject(), [])
    return (
        <ProjectStateContext.Provider
            value={useStateContainer<Project>(initState || defaultState)}
        >
            {children}
        </ProjectStateContext.Provider>
    )
}

export const useProjectState = (): StateContainerProps<Project> => {
    return useContext(ProjectStateContext)
}
