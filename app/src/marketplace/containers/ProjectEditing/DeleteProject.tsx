import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Button from '$shared/components/Button'
import { useProjectState } from '$mp/contexts/ProjectStateContext'
import { deleteProject } from '$app/src/services/projects'
import routes from '$routes'

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

    return (
        <div>
            <Title>Delete project</Title>
            <Description>Delete this project forever. You can&apos;t undo this.</Description>
            <Button
                kind="destructive"
                onClick={async () => {
                    try {
                        await deleteProject(project?.id || undefined)
                        history.push(routes.projects.index())
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
