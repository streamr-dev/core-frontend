import React from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import Button from '$shared/components/Button'
import { useCurrentDraft, useDraftId, useStreamEditorStore } from '$shared/stores/streamEditor'
import address0 from '$utils/address0'
import NewStreamPermissionsModal from '$app/src/modals/NewStreamPermissionsModal'
import { isAbandonment } from '$app/src/modals/ProjectModal'
import { Layer } from '$utils/Layer'
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
    disabled?: boolean
}

const PermissionList: React.FunctionComponent<Props> = ({ disabled }) => {
    const { permissions } = useCurrentDraft()

    const permissionList = Object.entries(permissions)

    const count = permissionList.length - (permissions[address0] ? 1 : 0)

    const { setPermissions } = useStreamEditorStore()

    const draftId = useDraftId()

    return (
        <Container>
            {permissionList.map(
                ([key, { bits = null } = {}]) =>
                    key !== address0 && (
                        <PermissionItem
                            key={key}
                            address={key}
                            permissionBits={bits || 0}
                            disabled={disabled}
                        />
                    ),
            )}
            <Footer>
                <span>
                    {count} Ethereum account{count === 1 ? '' : 's'}
                </span>
                <Button
                    kind="primary"
                    type="button"
                    disabled={disabled}
                    outline
                    onClick={async () => {
                        try {
                            const { account, bits } = await toaster(
                                NewStreamPermissionsModal,
                                Layer.Modal,
                            ).pop({
                                onBeforeSubmit(payload) {
                                    const { bits = null, persistedBits = null } = permissions?.[payload.account.toLowerCase()] || {}

                                    const currentBits = persistedBits === null && bits === null ? null : (bits || 0)

                                    if (currentBits !== null) {
                                        throw new Error('Permissions for this address already exist')
                                    }
                                },
                            })

                            if (draftId) {
                                setPermissions(draftId, account, bits)
                            }
                        } catch (e) {
                            if (isAbandonment(e)) {
                                return
                            }

                            console.warn('Could not add permissions for a new account', e)
                        }
                    }}
                >
                    Add a new account
                </Button>
            </Footer>
        </Container>
    )
}

export default PermissionList
