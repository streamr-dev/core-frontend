// @flow

import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import { ThemeProvider } from 'styled-components'

import { ImageTile } from '$shared/components/Tile'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import { type Product } from '$mp/flowtype/product-types'

import styles from './confirmDeployDataUnionDialog.pcss'

export type Props = {
    product: Product,
    onClose: () => void,
    onContinue: () => Promise<void>,
    onShowGuidedDialog: () => void,
    disabled?: boolean,
}

const tileTheme = {
    borderRadius: 0,
}

const ConfirmDeployDataUnionDialog = ({
    product,
    onClose,
    onContinue: onContinueProp,
    onShowGuidedDialog: onShowGuidedDialogProp,
    disabled,
}: Props) => {
    const [waitingOnContinue, setWaitingOnContinue] = useState(false)

    const onContinue = useCallback(async () => {
        setWaitingOnContinue(true)
        await onContinueProp()
    }, [onContinueProp])

    const onShowGuidedDialog = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        onShowGuidedDialogProp()
    }, [onShowGuidedDialogProp])

    // $FlowFixMe property `preview` is missing in  `File`.
    const image = String((product.newImageToUpload && product.newImageToUpload.preview) || product.imageUrl)

    return (
        <ModalPortal>
            <Dialog
                className={cx(styles.root, styles.ConfirmDeployDataUnionDialog)}
                title={`Deploy ${product.name}`}
                onClose={onClose}
                contentClassName={styles.content}
                renderActions={() => (
                    <div className={styles.footer}>
                        <div className={styles.footerText}>
                            Learn about
                            &nbsp;
                            <a href="#" onClick={onShowGuidedDialog}>
                                deploying drafts
                            </a>
                        </div>
                        <Buttons
                            actions={{
                                cancel: {
                                    title: 'Cancel',
                                    onClick: onClose,
                                    kind: 'link',
                                    disabled: waitingOnContinue,
                                },
                                continue: {
                                    title: 'Deploy',
                                    kind: 'primary',
                                    onClick: onContinue,
                                    spinner: waitingOnContinue,
                                    disabled: waitingOnContinue,
                                },
                            }}
                        />
                    </div>
                )}
                disabled={disabled}
            >
                <ThemeProvider theme={tileTheme}>
                    <ImageTile
                        className={styles.previewImage}
                        alt={product.name}
                        height="240px"
                        src={image}
                    />
                </ThemeProvider>
            </Dialog>
        </ModalPortal>
    )
}

export default ConfirmDeployDataUnionDialog
