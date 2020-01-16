// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import PngIcon from '$shared/components/PngIcon'
import Dialog from '$shared/components/Dialog'
import ModalPortal from '$shared/components/ModalPortal'
// import DiscardChangesPng from '$mp/assets/discard-changes.png'
// import DiscardChangesPng2x from '$mp/assets/discard-changes@2x.png'
import Button from '$shared/components/Button'
import Buttons from '$shared/components/Buttons'

import styles from './confirmSave.pcss'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
    onSave: () => void,
}

const ConfirmSaveDialog = ({ onSave, onClose, onContinue }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.confirmSave.title')}
            contentClassName={styles.content}
            onClose={onClose}
            renderActions={() => (
                <div className={styles.footer}>
                    <div className={styles.footerText}>
                        <Button
                            kind="primary"
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
                                kind: 'link',
                            },
                            continue: {
                                title: I18n.t('modal.common.save'),
                                kind: 'primary',
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
    </ModalPortal>
)

export default ConfirmSaveDialog
