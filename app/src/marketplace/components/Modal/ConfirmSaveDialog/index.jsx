// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Button } from 'reactstrap'

import PngIcon from '$shared/components/PngIcon'
import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'

import styles from './confirmSave.pcss'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
    onSave: () => void,
}

const ConfirmSaveDialog = ({ onSave, onClose, onContinue }: Props) => (
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
                                onClick: onSave,
                            },
                        }}
                    />
                </div>
            )}
        >
            <PngIcon
                className={styles.icon}
                name="discardChanges"
                alt={I18n.t('modal.confirmSave.title')}
            />
            <Translate
                value="modal.confirmSave.message"
                tag="p"
                dangerousHTML
            />
        </Dialog>
    </Modal>
)

export default ConfirmSaveDialog
