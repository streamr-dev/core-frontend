import React, { useMemo, useState } from 'react'
import { isEthereumAddress } from '~/marketplace/utils/validate'
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
}

export default function AddNodeAddressModal({
    title = 'Add node address',
    onResolve,
    onSubmit,
    submitLabel = 'Add node address',
    ...props
}: Props) {
    const [address, setAddress] = useState('')

    const isValidAddress = useMemo(
        () => (address.length > 0 ? isEthereumAddress(address) : true),
        [address],
    )

    return (
        <FormModal
            {...props}
            title={title}
            submitLabel={submitLabel}
            onSubmit={async () => {
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
        </FormModal>
    )
}
