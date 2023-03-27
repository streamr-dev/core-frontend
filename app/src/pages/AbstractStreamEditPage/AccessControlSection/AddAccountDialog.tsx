import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import useModal from '$shared/hooks/useModal'
import { UPDATE_PERMISSION } from '$shared/components/PermissionsProvider/utils/reducer'
import { usePermissionsDispatch, usePermissionsState } from '$shared/components/PermissionsProvider'
import UnstyledButton from '$shared/components/Button'
import UnstyledLabel from '$ui/Label'
import Text from '$ui/Text'
import { TABLET, COLORS } from '$shared/utils/styled'
import { isEthereumAddress } from '$mp/utils/validate'
import UnstyledErrors, { MarketplaceTheme } from '$ui/Errors'
import PermissionEditor from './PermissionEditor'

const Container = styled.div`
    display: grid;
    grid-template-rows: auto auto auto auto;
    gap: 40px;
    width: 100%;
`

const Separator = styled.div`
    border-bottom: 1px solid ${COLORS.separator};

    @media ${TABLET} {
        border-bottom: none;
    }
`

const Label = styled(UnstyledLabel)`
    display: flex;
`

const Button = styled(UnstyledButton)`
    width: auto;

    @media ${TABLET} {
        width: fit-content;
        justify-self: right;
    }
`

const Errors = styled(UnstyledErrors)`
    display: flex;
`

const UnstyledAddAccountDialog = ({ onClose, ...props }) => {
    const [permissions, setPermissions] = useState<number>(0)
    const [address, setAddress] = useState<string>('')
    const [error, setError] = useState<string>(null)
    const dispatch = usePermissionsDispatch()
    const { combinations } = usePermissionsState()

    const persist = useCallback(() => {
        dispatch({
            type: UPDATE_PERMISSION,
            user: address,
            // eslint-disable-next-line no-bitwise
            value: permissions,
        })
    }, [dispatch, address, permissions])

    return (
        <ModalPortal>
            <Dialog
                {...props}
                onClose={onClose}
                title="Add a new account"
                showCloseIcon
            >
                <Container>
                    <div>
                        <Label>Wallet address</Label>
                        <Text
                            onCommit={(value) => {
                                setAddress(value)
                                setError(null)
                            }}
                            placeholder="0x..."
                        />
                        {error != null && <Errors theme={MarketplaceTheme} overlap>{error}</Errors>}
                    </div>
                    <Separator />
                    <PermissionEditor
                        address={address}
                        permissionBits={permissions}
                        onChange={(newValue) => setPermissions(newValue)}
                    />
                    <Button
                        kind="primary"
                        onClick={() => {
                            if (address.length === 0) {
                                setError('Address required')
                                return
                            }

                            if (!isEthereumAddress(address)) {
                                setError('Invalid address format')
                                return
                            }

                            if (Object.keys(combinations).includes(address.toLowerCase())) {
                                setError('Permissions for this address already exist')
                                return
                            }

                            persist()
                            onClose()
                        }}
                    >
                        Add new account
                    </Button>
                </Container>
            </Dialog>
        </ModalPortal>
    )
}

const AddAccountDialog = styled(UnstyledAddAccountDialog)`
    width: 100%;

    @media ${TABLET} {
        width: 670px;
    }
`

const AddAccountDialogWrap: React.FunctionComponent = () => {
    const { api, isOpen, value } = useModal('accesscontrol.addaccount')

    if (!isOpen) {
        return null
    }

    return <AddAccountDialog onClose={() => api.close()} />
}

export default AddAccountDialogWrap
