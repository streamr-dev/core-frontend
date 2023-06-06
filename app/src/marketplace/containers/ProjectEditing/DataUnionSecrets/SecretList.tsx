import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { DataUnionSecret } from '$app/src/marketplace/types/project-types'
import { SecretItem } from './SecretItem'

const Container = styled.div`
    display: grid;
    grid-gap: 12px;
    margin: 32px 0;
`

type Props = {
    secrets: DataUnionSecret[]
    onEdit: (secret: DataUnionSecret) => void
    onDelete: (secret: DataUnionSecret) => void
}

export const SecretList: FunctionComponent<Props> = ({
    secrets,
    onEdit,
    onDelete,
}: Props) => {
    if (secrets == null || secrets.length === 0) {
        return null
    }

    return (
        <Container>
            {secrets.map((secret) => (
                <SecretItem
                    key={secret.id}
                    secret={secret}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </Container>
    )
}
