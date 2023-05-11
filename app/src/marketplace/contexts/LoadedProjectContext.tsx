import React, {createContext, FunctionComponent, ReactNode, useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Project, ProjectId} from "$mp/types/project-types"
import {getProject, TheGraphProject} from "$app/src/services/projects"
import {mapGraphProjectToDomainModel} from "$mp/utils/project-mapper"

export type LoadedProjectState = {
    loadedProject: Project | undefined
    theGraphProject: TheGraphProject | undefined
}

const useLoadedProjectImplementation = (projectId: ProjectId): LoadedProjectState => {
    const [project, setProject] = useState<TheGraphProject>()
    const [mappedProject, setMappedProject] = useState<Project>()
    useEffect(() => {
        const loadData = async () => {
            const theGraphProject = await getProject(projectId)
            setProject(theGraphProject)
            setMappedProject(await mapGraphProjectToDomainModel(theGraphProject))
            console.log('useLoadedProjectImplementation')
        }

        try {
            loadData()
        } catch (e) {
            console.error(e)
        }
    }, [projectId])

    return {
        loadedProject: mappedProject,
        theGraphProject: project,
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
