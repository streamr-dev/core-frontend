import React from 'react'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import { useProjectController } from "./ProjectController"

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
    const { deleteProject } = useProjectController()

    return (
        <div>
            <Title>Delete project</Title>
            <Description>Delete this project forever. You can&apos;t undo this.</Description>
            <Button
                kind='destructive'
                onClick={async () => { deleteProject() }}
            >
                Delete
            </Button>
        </div>
    )
}

export default DeleteProject
