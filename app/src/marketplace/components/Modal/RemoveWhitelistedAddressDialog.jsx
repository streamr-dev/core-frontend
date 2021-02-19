import React from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

const UnstyledRemoveWhitelistedAddressDialog = ({ onClose, onContinue, ...props }) => (
    <ModalPortal>
        <Dialog
            {...props}
            title="Remove from whitelist?"
            onClose={onClose}
            actions={{
                cancel: {
                    title: 'Cancel',
                    onClick: () => onClose(),
                    kind: 'link',
                },
                remove: {
                    title: 'Remove',
                    kind: 'destructive',
                    onClick: () => onContinue(),
                },
            }}
        >
            <p>
                If you remove this buyer from your whitelist they will
                <br />
                not be able to resubscribe. Do you want to continue?
            </p>
        </Dialog>
    </ModalPortal>
)

const RemoveWhitelistedAddressDialog = styled(UnstyledRemoveWhitelistedAddressDialog)`
`

export default RemoveWhitelistedAddressDialog
