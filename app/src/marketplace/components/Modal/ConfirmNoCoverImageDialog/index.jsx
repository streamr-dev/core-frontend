// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import NoCoverPng from '../../../assets/no_cover.png'
import NoCoverPng2x from '../../../assets/no_cover@2x.png'
import Dialog from '../Dialog'
import withI18n from '../../../containers/WithI18n'

import styles from './confirmNoCoverImage.pcss'

export type Props = {
    closeOnContinue: boolean,
    onClose: () => void,
    onContinue: () => void,
    translate: (key: string, options: any) => string,
}

const ConfirmNoCoverImageDialog = ({ closeOnContinue, onClose, onContinue, translate }: Props) => (
    <Dialog
        title={translate('modal.confirmNoCoverImage.title')}
        contentClassName={styles.content}
        onClose={onClose}
        actions={{
            cancel: {
                title: translate('modal.common.cancel'),
                onClick: onClose,
                color: 'link',
            },
            continue: {
                title: translate('modal.common.continue'),
                color: 'primary',
                onClick: () => {
                    onContinue()

                    if (closeOnContinue) {
                        onClose()
                    }
                },
            },
        }}
    >
        <img
            className={styles.icon}
            src={NoCoverPng}
            srcSet={`${NoCoverPng2x} 2x`}
            alt={translate('modal.confirmNoCoverImage.title')}
        />
        <p><Translate value="modal.confirmNoCoverImage.message" dangerousHTML /></p>
    </Dialog>
)

ConfirmNoCoverImageDialog.defaultProps = {
    closeOnContinue: true,
}

export default withI18n(ConfirmNoCoverImageDialog)
