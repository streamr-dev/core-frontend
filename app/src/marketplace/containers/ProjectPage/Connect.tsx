import React, {FunctionComponent} from 'react'
import ProjectPage, { ProjectPageContainer } from '$shared/components/ProjectPage'
import { StreamConnect } from '$shared/components/StreamConnect'
import { useUserHasAccessToProject } from '$mp/containers/ProductController/useUserHasAccessToProject'
import { WhiteBox } from '$shared/components/WhiteBox'
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {GetAccess} from "$mp/components/GetAccess/GetAccess"

export const Connect: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()
    const userHasAccess: boolean = useUserHasAccessToProject()
    return <ProjectPage>
        <ProjectPageContainer>
            {
                userHasAccess
                    ? <WhiteBox>
                        <StreamConnect streams={project.streams}/>
                    </WhiteBox>
                    : <GetAccess project={project}/>
            }
        </ProjectPageContainer>
    </ProjectPage>
}
