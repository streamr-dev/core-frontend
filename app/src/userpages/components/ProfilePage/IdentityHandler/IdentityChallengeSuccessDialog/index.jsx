// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'

type Props = {
    onClose: () => void,
    waiting: boolean,
}

const IdentityNameDialog = ({ onClose, waiting }: Props) => (
    <Dialog
        title={I18n.t('modal.newIdentity.defaultTitle')}
        onClose={onClose}
        waiting={waiting}
    >
        <div>
            success
        </div>
    </Dialog>
)

export default IdentityNameDialog
