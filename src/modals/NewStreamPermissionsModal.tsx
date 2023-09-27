import React, { useState } from 'react'
import styled from 'styled-components'
import { z } from 'zod'
import { COLORS, TABLET } from '~/shared/utils/styled'
import { Bits, setBits, unsetBits } from '~/shared/stores/streamEditor'
import PermissionEditor from '~/pages/AbstractStreamEditPage/AccessControlSection/PermissionEditor'
import { isEthereumAddress } from '~/marketplace/utils/validate'
import address0 from '~/utils/address0'
import UnstyledLabel from '~/shared/components/Ui/Label'
import UnstyledErrors, { MarketplaceTheme } from '~/shared/components/Ui/Errors'
import Text from '~/shared/components/Ui/Text'
import { isMessagedObject } from '~/utils'
import FormModal, { FormModalProps } from './FormModal'
import { RejectionReason } from './BaseModal'

const Separator = styled.div`
    border-bottom: 1px solid ${COLORS.separator};
    margin: 24px 0;

    @media ${TABLET} {
        border: 0;
        margin: 40px 0 0;
    }
`

const Label = styled(UnstyledLabel)`
    display: flex;
`

const Errors = styled(UnstyledErrors)`
    display: flex;
`

interface PermissionBits {
    account: string
    bits: number
}

interface NewStreamPermissionsModalProps extends FormModalProps {
    onResolve?: (payload: PermissionBits) => void
    onBeforeSubmit?: (payload: PermissionBits) => void
}

export default function NewStreamPermissionsModal({
    onReject,
    onResolve,
    onBeforeSubmit,
    ...props
}: NewStreamPermissionsModalProps) {
    const [permissionBits, setPermissionBits] = useState(0)

    const [address, setAddress] = useState('')

    const [error, setError] = useState('')

    const cancelLabel = address || permissionBits !== 0 ? 'Cancel' : undefined

    return (
        <FormModal
            {...props}
            title="Add a new account"
            onReject={onReject}
            onBeforeAbort={(reason) => {
                return (
                    (permissionBits === 0 && address === '') ||
                    reason !== RejectionReason.Backdrop
                )
            }}
            onSubmit={() => {
                if (address.toLowerCase() === address0) {
                    return void setError('Invalid address')
                }

                if (address.length === 0) {
                    return void setError('Address required')
                }

                if (!isEthereumAddress(address)) {
                    return void setError('Invalid address format')
                }

                const result = {
                    account: address,
                    bits: permissionBits,
                }

                try {
                    onBeforeSubmit?.(result)
                } catch (e: unknown) {
                    if (isMessagedObject(e)) {
                        return void setError(e.message)
                    }

                    return void setError('Something bad happened')
                }

                onResolve?.(result)
            }}
            canSubmit={!!address}
            submitLabel="Add new account"
            cancelLabel={cancelLabel}
        >
            <div>
                <Label>Wallet address</Label>
                <Text
                    onCommit={(value) => {
                        setAddress(value)
                        setError('')
                    }}
                    placeholder="0x..."
                />
                {!!error && (
                    <Errors theme={MarketplaceTheme} overlap>
                        {error}
                    </Errors>
                )}
            </div>
            <Separator />
            <PermissionEditor
                address={address}
                permissionBits={permissionBits}
                onChange={(permission, enabled) => {
                    setPermissionBits(
                        (enabled ? setBits : unsetBits)(permissionBits, Bits[permission]),
                    )
                }}
            />
        </FormModal>
    )
}