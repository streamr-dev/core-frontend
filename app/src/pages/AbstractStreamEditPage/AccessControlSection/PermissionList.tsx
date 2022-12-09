import React, { useMemo } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import { usePermissionsState } from '$shared/components/PermissionsProvider'
import PermissionItem from './PermissionItem'

const Container = styled.div`
    background: #f1f1f1;
    border-radius: 4px;
    display: grid;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1.5em;
    margin-top: 16px;
`

const Footer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 8px;
    align-items: center;
`

type Props = {
    disabled?: boolean,
}

const PermissionList: React.FunctionComponent<Props> = ({ disabled }) => {
    const { changeset, combinations } = usePermissionsState()
    const permissions = useMemo(() => (
        Object.entries({ ...combinations, ...changeset })
    ), [combinations, changeset])

    return (
        <Container>
            {permissions.map(([key, value]) => (
                <PermissionItem
                    key={key}
                    address={key}
                    permissionBits={value}
                    disabled={disabled}
                />
            ))}
            <Footer>
                <span>
                    {permissions.length} Ethereum account{permissions.length > 1 ? 's' : ''}
                </span>
                <Button
                    kind="primary"
                    disabled={disabled}
                    outline
                    onClick={() => console.log('add')}
                >
                    Add a new account
                </Button>
                <Button
                    kind="primary"
                    disabled={disabled}
                    onClick={() => console.log('save')}
                >
                    Save
                </Button>
            </Footer>
        </Container>
    )
}

export default PermissionList
