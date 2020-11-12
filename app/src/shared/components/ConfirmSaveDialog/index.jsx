// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'

import PngIcon from '$shared/components/PngIcon'
import Dialog from '$shared/components/Dialog'
import ModalPortal from '$shared/components/ModalPortal'
import Buttons from '$shared/components/Buttons'

import styles from './confirmSave.pcss'

export type Props = {
    onClose: () => void,
    onContinue: () => void,
    onSave: () => void,
    children?: Node,
}

const ConfirmSaveDialog = ({ onSave, onClose, onContinue, children }: Props) => (
    <ModalPortal>
        <Dialog
            title={I18n.t('modal.confirmSave.title')}
            contentClassName={styles.content}
            onClose={onClose}
            renderActions={() => (
                <div className={styles.footer}>
                    <Buttons
                        className={styles.footerText}
                        actions={{
                            dontSave: {
                                title: I18n.t('modal.confirmSave.dontSave'),
                                kind: 'primary',
                                outline: true,
                                onClick: onContinue,
                            },
                        }}
                    />
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
            {children}
        </Dialog>
    </ModalPortal>
)

export default ConfirmSaveDialog
