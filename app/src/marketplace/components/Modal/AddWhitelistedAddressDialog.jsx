import React, { useState } from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Label from '$ui/Label'
import Text from '$ui/Text'
import { isEthereumAddress } from '$mp/utils/validate'

const UnstyledAddWhitelistedAddressDialog = ({ onClose, onContinue, ...props }) => {
    const [address, setAddress] = useState('')

    return (
        <ModalPortal>
            <Dialog
                {...props}
                title="Add a buyer to the whitelist"
                onClose={() => onClose()}
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: () => onClose(),
                        kind: 'link',
                    },
                    add: {
                        title: 'Add',
                        kind: 'primary',
                        onClick: () => onContinue(address),
                        disabled: !isEthereumAddress(address),
                    },
                }}
            >
                <Label>
                    Ethereum Address
                </Label>
                <Text
                    onCommit={setAddress}
                    placeholder="0x..."
                />
            </Dialog>
        </ModalPortal>
    )
}

const AddWhitelistedAddressDialog = styled(UnstyledAddWhitelistedAddressDialog)`
    ${Label} {
        align-self: start;
        width: 100%;
        text-align: left;
    }
`

export default AddWhitelistedAddressDialog
