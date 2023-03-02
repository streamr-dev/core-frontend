import React, {createContext, FunctionComponent, ReactNode, useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Project, ProjectId} from "$mp/types/project-types"
import {getProject} from "$app/src/services/projects"
import {mapGraphProjectToDomainModel} from "$mp/utils/project-mapper"

export type LoadedProjectState = {
    loadedProject: Project | undefined
}

const useLoadedProjectImplementation = (projectId: ProjectId): LoadedProjectState => {
    const [mappedProject, setMappedProject] = useState<Project>()
    useEffect(() => {
        const loadData = async () => {
            const theGraphProject = await getProject(projectId)
            setMappedProject(mapGraphProjectToDomainModel(theGraphProject))
        }
        loadData()
    }, [projectId])

    return {
        loadedProject: mappedProject
    }
}

export const LoadedProjectContext = createContext<LoadedProjectState>(null)

export const LoadedProjectContextProvider: FunctionComponent<{children: ReactNode}> = ({children}) => {
    const params = useParams<{id: string}>()
    return <LoadedProjectContext.Provider value={useLoadedProjectImplementation(params.id)}>{children}</LoadedProjectContext.Provider>
}

export const useLoadedProject = (): LoadedProjectState => {
    return useContext(LoadedProjectContext)
}
