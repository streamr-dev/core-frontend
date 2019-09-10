// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Button } from 'reactstrap'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import BrowserNotSupportedPng from '$shared/assets/images/browser_not_supported.png'
import BrowserNotSupportedPng2x from '$shared/assets/images/browser_not_supported@2x.png'
import Buttons from '$shared/components/Buttons'

import styles from './confirmSave.pcss'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
}

const ConfirmSaveDialog = ({ onClose, onContinue }: Props) => (
    <Modal>
        <Dialog
            title={I18n.t('modal.confirmSave.title')}
            contentClassName={styles.content}
            onClose={onClose}
            renderActions={() => (
                <div className={styles.footer}>
                    <div className={styles.footerText}>
                        <Button
                            onClick={onContinue}
                            outline
                        >
                            {I18n.t('modal.confirmSave.dontSave')}
                        </Button>
                    </div>
                    <Buttons
                        actions={{
                            cancel: {
                                title: I18n.t('modal.common.cancel'),
                                onClick: onClose,
                                color: 'link',
                            },
                            continue: {
                                title: I18n.t('modal.common.save'),
                                color: 'primary',
                                onClick: onContinue,
                            },
                        }}
                    />
                </div>
            )}
        >
            <img
                className={styles.icon}
                src={BrowserNotSupportedPng}
                srcSet={`${BrowserNotSupportedPng2x} 2x`}
                alt={I18n.t('modal.confirmSave.title')}
            />
            <p><Translate value="modal.confirmSave.message" dangerousHTML /></p>
        </Dialog>
    </Modal>
)

export default ConfirmSaveDialog
