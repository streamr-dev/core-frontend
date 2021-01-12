import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

const UnstyledRemoveWhitelistedAddressDialog = ({ onClose, onContinue, ...props }) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.whitelistEdit.removeAddressTitle')}
            onClose={onClose}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    onClick: () => onClose(),
                    kind: 'link',
                },
                remove: {
                    title: I18n.t('modal.whitelistEdit.remove'),
                    kind: 'destructive',
                    onClick: () => onContinue(),
                },
            }}
            {...props}
        >
            <Translate value="modal.whitelistEdit.removeMessage" dangerousHTML />
        </Dialog>
    </ModalPortal>
)

const RemoveWhitelistedAddressDialog = styled(UnstyledRemoveWhitelistedAddressDialog)`
`

export default RemoveWhitelistedAddressDialog
