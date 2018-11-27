// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import NoCoverPng from '../../../assets/no_cover.png'
import NoCoverPng2x from '../../../assets/no_cover@2x.png'
import Dialog from '$shared/components/Dialog'
import withI18n from '../../../containers/WithI18n'

import styles from './noStreamsWarning.pcss'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
    translate: (key: string, options: any) => string,
    waiting: boolean,
}

const NoStreamsWarningDialog = ({ onClose, onContinue, translate, waiting }: Props) => (
    <Dialog
        title={translate('modal.noStreams.title')}
        contentClassName={styles.content}
        onClose={onClose}
        waiting={waiting}
        actions={{
            cancel: {
                title: translate('modal.common.cancel'),
                onClick: onClose,
                color: 'link',
            },
            continue: {
                title: translate('editProductPage.edit'),
                color: 'primary',
                onClick: onContinue,
            },
        }}
    >
        <img
            className={styles.icon}
            src={NoCoverPng}
            srcSet={`${NoCoverPng2x} 2x`}
            alt={translate('modal.noStreams.title')}
        />
        <p><Translate value="modal.noStreams.message" dangerousHTML /></p>
    </Dialog>
)

NoStreamsWarningDialog.defaultProps = {
    waiting: false,
}

export default withI18n(NoStreamsWarningDialog)
