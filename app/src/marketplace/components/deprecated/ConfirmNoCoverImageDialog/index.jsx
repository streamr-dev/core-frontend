// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import NoCoverPng from '$mp/assets/no_cover.png'
import NoCoverPng2x from '$mp/assets/no_cover@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './confirmNoCoverImage.pcss'

export type Props = {
    closeOnContinue: boolean,
    onClose: () => void,
    onContinue: () => void,
}

const ConfirmNoCoverImageDialog = ({ closeOnContinue, onClose, onContinue }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.confirmNoCoverImage.title')}
            contentClassName={styles.content}
            onClose={onClose}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    onClick: onClose,
                    kind: 'link',
                },
                continue: {
                    title: I18n.t('modal.common.continue'),
                    kind: 'primary',
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
                alt={I18n.t('modal.confirmNoCoverImage.title')}
            />
            <p><Translate value="modal.confirmNoCoverImage.message" dangerousHTML /></p>
        </Dialog>
    </ModalPortal>
)

ConfirmNoCoverImageDialog.defaultProps = {
    closeOnContinue: true,
}

export default ConfirmNoCoverImageDialog
