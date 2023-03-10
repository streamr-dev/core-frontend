import React, {FunctionComponent, ReactNode, useEffect, useMemo, useState} from "react"
import styled from "styled-components"
import {Link} from "react-router-dom"
import Button from "$shared/components/Button"
import {useLoadedProject} from "$mp/contexts/LoadedProjectContext"
import {getProjectTitle} from "$mp/containers/ProjectPage/utils"
import getCoreConfig from "$app/src/getters/getCoreConfig"
import {getUserPermissionsForProject} from "$app/src/services/projects"
import {useAuthController} from "$auth/hooks/useAuthController"
import SvgIcon from "$shared/components/SvgIcon"
import routes from "$routes"

const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
`
const EditButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  margin-left: 10px;
`

export const ProjectPageTitle: FunctionComponent = () => {
    const {loadedProject: project} = useLoadedProject()
    const title = useMemo<ReactNode>(() => getProjectTitle(project), [project])
    const {projectRegistry} = getCoreConfig()
    const {currentAuthSession} = useAuthController()
    const [canEdit, setCanEdit] = useState<boolean>(false)
    useEffect(() => {
        if (currentAuthSession.address && project?.id) {
            getUserPermissionsForProject(projectRegistry.chainId, project.id, currentAuthSession.address).then((permissions) => {
                setCanEdit(permissions.canEdit)
            })
        }
    }, [project, currentAuthSession, projectRegistry])

    return <PageTitleContainer>
        <span>{title}</span>
        {canEdit && <EditButton tag={Link} to={routes.products.edit({id: project.id})} kind={'secondary'} size={'mini'}>
            <SvgIcon name={'pencilFull'} />
        </EditButton>}
    </PageTitleContainer>
}
