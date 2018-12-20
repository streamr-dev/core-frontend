// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'

type Props = {
    title?: string,
    onClose: () => void,
    waiting: boolean,
    children?: Node,
}

const GenericErrorDialog = ({
    title,
    onClose,
    children,
    waiting,
    ...props
}: Props) => (
    <Dialog
        onClose={onClose}
        title={!waiting ? title || I18n.t('modal.genericError.defaultTitle') : I18n.t('modal.genericError.waiting')}
        waiting={waiting}
        {...props}
    >
        <PngIcon name="wallet" />
        {children}
    </Dialog>
)

export default GenericErrorDialog
