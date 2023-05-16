import React, { FunctionComponent, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import useDataUnionSecrets from '$mp/modules/dataUnion/hooks/useDataUnionSecrets'
import Button from '$shared/components/Button'
import { Layer } from '$app/src/utils/Layer'
import { DataUnionSecret } from '$app/src/marketplace/types/project-types'
import { SecretList } from './SecretList'
import { SecretEditor } from './SecretEditor'

const secretEditorModal = toaster(SecretEditor, Layer.Modal)

const Section = styled.div`
    background: none;
    max-width: 678px;
`

const Title = styled.p`
  font-size: 34px;
  line-height: 34px;
  color: black;
  margin-bottom: 30px;
`

const Description = styled.p`
  color: black;
  font-size: 16px;
`

export const DataUnionSecrets: FunctionComponent = () => {
    const { state: project } = useContext(ProjectStateContext)
    const { load, secrets, isLoaded, remove } = useDataUnionSecrets()

    const onAdd = useCallback(async () => {
        if (project.existingDUAddress == null || project.dataUnionChainId == null) {
            return
        }

        try {
            await secretEditorModal.pop({
                chainId: project.dataUnionChainId,
                dataUnionId: project.existingDUAddress,
            })
        } catch (e) {
            // cancelled
        }
    }, [project.dataUnionChainId, project.existingDUAddress])

    const onEdit = useCallback(async (secret: DataUnionSecret) => {
        if (project.existingDUAddress == null || project.dataUnionChainId == null) {
            return
        }

        try {
            await secretEditorModal.pop({
                chainId: project.dataUnionChainId,
                dataUnionId: project.existingDUAddress,
                secret,
            })
        } catch (e) {
            // cancelled
        }
    }, [project.dataUnionChainId, project.existingDUAddress])

    const onDelete = useCallback(async (secret: DataUnionSecret) => {
        if (project.existingDUAddress == null || project.dataUnionChainId == null) {
            return
        }

        await remove({
            chainId: project.dataUnionChainId,
            dataUnionId: project.existingDUAddress,
            id: secret.id,
        })
    }, [project.dataUnionChainId, project.existingDUAddress, remove])

    return (
        <Section id="secrets">
            <Title>Shared secrets</Title>
            <Description>
                These settings are only available once you have deployed your Data Union,
                and provides access control for your Data Union. Create, name and revoke
                shared secrets from here.
            </Description>
            <SecretList
                secrets={secrets}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            <Button
                hidden={isLoaded}
                onClick={() => {
                    if (project.existingDUAddress != null && project.dataUnionChainId != null) {
                        load(project.existingDUAddress, project.dataUnionChainId)
                    }
                }}
            >
                Load secrets
            </Button>
            <Button
                hidden={!isLoaded}
                onClick={onAdd}
            >
                Add a shared secret
            </Button>
        </Section>
    )
}
