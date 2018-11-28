// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import NoCoverPng from '../../../assets/no_cover.png'
import NoCoverPng2x from '../../../assets/no_cover@2x.png'
import Dialog from '../Dialog'
import withI18n from '../../../containers/WithI18n'

import styles from './noStreamsWarning.pcss'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
    waiting: boolean,
}

const NoStreamsWarningDialog = ({ onClose, onContinue, waiting }: Props) => (
    <Dialog
        title={I18n.t('modal.noStreams.title')}
        contentClassName={styles.content}
        onClose={onClose}
        waiting={waiting}
        actions={{
            cancel: {
                title: I18n.t('modal.common.cancel'),
                onClick: onClose,
                color: 'link',
            },
            continue: {
                title: I18n.t('editProductPage.edit'),
                color: 'primary',
                onClick: onContinue,
            },
        }}
    >
        <img
            className={styles.icon}
            src={NoCoverPng}
            srcSet={`${NoCoverPng2x} 2x`}
            alt={I18n.t('modal.noStreams.title')}
        />
        <p><Translate value="modal.noStreams.message" dangerousHTML /></p>
    </Dialog>
)

NoStreamsWarningDialog.defaultProps = {
    waiting: false,
}

export default withI18n(NoStreamsWarningDialog)
