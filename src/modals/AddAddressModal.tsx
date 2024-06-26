import React, { ReactNode, useMemo, useState } from 'react'
import styled from 'styled-components'
import { isAddress } from 'web3-validator'
import { Alert as PrestyledAlert } from '~/components/Alert'
import FormModal, {
    FieldWrap,
    FormModalProps,
    Section,
    TextInput,
} from '~/modals/FormModal'
import Label from '~/shared/components/Ui/Label'

interface Props extends Omit<FormModalProps, 'onSubmit'> {
    onResolve?: (amount: string) => void
    onSubmit: (address: string) => Promise<void>
    warning?: ReactNode
}

export default function AddNodeAddressModal({
    title = 'Add node address',
    onResolve,
    onSubmit,
    submitLabel = 'Add node address',
    warning,
    ...props
}: Props) {
    const [address, setAddress] = useState('')

    const isValidAddress = useMemo(
        () => (address.length > 0 ? isAddress(address) : true),
        [address],
    )

    return (
        <FormModal
            {...props}
            title={title}
            submitLabel={submitLabel}
            canSubmit={isValidAddress && address.length > 0}
            onSubmit={() => {
                onSubmit(address)
                onResolve?.(address)
            }}
        >
            <Section>
                <Label>Address</Label>
                <FieldWrap $invalid={!isValidAddress}>
                    <TextInput
                        name="amount"
                        autoFocus
                        onChange={({ target }) => void setAddress(target.value)}
                        placeholder="0x795...f109A"
                        value={address}
                    />
                </FieldWrap>
            </Section>
            {warning != null && (
                <Alert type="error" title="">
                    {warning}
                </Alert>
            )}
        </FormModal>
    )
}

const Alert = styled(PrestyledAlert)`
    margin-top: 10px;
`
