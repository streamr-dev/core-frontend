// @flow

import React, { type Node } from 'react'

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
            title="You have unsaved changes"
            contentClassName={styles.content}
            onClose={onClose}
            renderActions={() => (
                <div className={styles.footer}>
                    <Buttons
                        className={styles.footerText}
                        actions={{
                            dontSave: {
                                title: 'Don\'t save',
                                kind: 'primary',
                                outline: true,
                                onClick: onContinue,
                            },
                        }}
                    />
                    <Buttons
                        actions={{
                            cancel: {
                                title: 'Cancel',
                                onClick: onClose,
                                kind: 'link',
                            },
                            continue: {
                                title: 'Save',
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
                alt="You have unsaved changes"
            />
            {children}
        </Dialog>
    </ModalPortal>
)

export default ConfirmSaveDialog
