import React from 'react'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

const SwitchWalletAccountDialog = ({ onClose, onContinue, ...props }) => (
    <ModalPortal>
        <Dialog
            {...props}
            title="Switch wallet account?"
            onClose={() => onClose()}
            actions={{
                cancel: {
                    title: 'Cancel',
                    onClick: () => onClose(),
                    kind: 'link',
                },
                add: {
                    title: 'Switch',
                    kind: 'primary',
                    onClick: () => onContinue(),
                },
            }}
        >
            <p>
                The active account in your wallet has changed.
                <br />
                You&apos;re about to switch to different Core account.
                <br />
                Unsaved work will be lost.
            </p>
        </Dialog>
    </ModalPortal>
)

export default SwitchWalletAccountDialog
