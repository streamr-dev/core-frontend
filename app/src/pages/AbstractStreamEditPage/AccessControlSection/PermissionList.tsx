import React, { useMemo } from 'react'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import { usePermissionsState } from '$shared/components/PermissionsProvider'
import usePersistChangeset from '$shared/components/PermissionsProvider/usePersistChangeset'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useModal from '$shared/hooks/useModal'
import address0 from '$utils/address0'
import PermissionItem from './PermissionItem'
import AddAccountDialog from './AddAccountDialog'

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
    const { api: addModal } = useModal('accesscontrol.addaccount')
    const { changeset, combinations } = usePermissionsState()
    const persist = usePersistChangeset()
    const permissions = useMemo(() => (
        Object.entries({ ...combinations, ...changeset }).filter((p) => p[0] !== address0)
    ), [combinations, changeset])

    return (
        <Container>
            {permissions.map(([key, value]) => (
                <PermissionItem
                    key={key}
                    address={key}
                    permissionBits={value as number}
                    disabled={disabled}
                />
            ))}
            <Footer>
                <span>
                    {permissions.length} Ethereum account{permissions.length === 1 ? '' : 's'}
                </span>
                <Button
                    kind="primary"
                    type="button"
                    disabled={disabled}
                    outline
                    onClick={() => addModal.open()}
                >
                    Add a new account
                </Button>
                <Button
                    kind="primary"
                    type="button"
                    disabled={disabled || Object.entries(changeset).length === 0}
                    onClick={() => persist(() => {
                        Notification.push({
                            title: 'Stream permissions updated',
                            icon: NotificationIcon.CHECKMARK,
                        })
                    })}
                >
                    Save
                </Button>
            </Footer>
            <AddAccountDialog />
        </Container>
    )
}

export default PermissionList
