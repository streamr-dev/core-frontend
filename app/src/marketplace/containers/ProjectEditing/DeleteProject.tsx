import React from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import Button from '$shared/components/Button'
import { useProjectState } from '$mp/contexts/ProjectStateContext'
import routes from '$routes'
import { useProjectController } from './ProjectController'

const Title = styled.p`
  font-size: 34px;
  line-height: 34px;
  color: black;
  margin-bottom: 30px;
`

const Description = styled.p`
  color: black;
  font-size: 16px;
  padding-bottom: 28px;
`

const DeleteProject = () => {
    const { state: project } = useProjectState()
    const history = useHistory()
    const { pathname } = useLocation()
    const { deleteProject } = useProjectController()

    return (
        <div>
            <Title>Delete project</Title>
            <Description>Delete this project forever. You can&apos;t undo this.</Description>
            <Button
                kind="destructive"
                onClick={async () => {
                    try {
                        await deleteProject()

                        // Navigate away from now gone project (if user stayed on the edit page)
                        if (pathname === routes.projects.edit({ id: project?.id })) {
                            history.push(routes.projects.index())
                        }
                    } catch (e) {
                        console.warn('Could not delete project', e)
                    }
                }}
            >
                Delete
            </Button>
        </div>
    )
}

export default DeleteProject
