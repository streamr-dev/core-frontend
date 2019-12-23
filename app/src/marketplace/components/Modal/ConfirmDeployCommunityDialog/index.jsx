// @flow

import React, { useState, useCallback } from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import FallbackImage from '$shared/components/FallbackImage'
import { type Product } from '$mp/flowtype/product-types'

import styles from './confirmDeployCommunityDialog.pcss'

export type Props = {
    product: Product,
    onClose: () => void,
    onContinue: () => Promise<void>,
    onShowGuidedDialog: () => void,
}

const ConfirmDeployCommunityDialog = ({ product, onClose, onContinue: onContinueProp, onShowGuidedDialog: onShowGuidedDialogProp }: Props) => {
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
                className={cx(styles.root, styles.ConfirmDeployCommunityDialog)}
                title={I18n.t('modal.deployCommunity.confirm.title', {
                    name: product.name,
                })}
                onClose={onClose}
                contentClassName={styles.content}
                renderActions={() => (
                    <div className={styles.footer}>
                        <div className={styles.footerText}>
                            {I18n.t('modal.deployCommunity.confirm.learnAbout')}
                            &nbsp;
                            <a href="#" onClick={onShowGuidedDialog}>
                                {I18n.t('modal.deployCommunity.confirm.deployingDrafts')}
                            </a>
                        </div>
                        <Buttons
                            actions={{
                                cancel: {
                                    title: I18n.t('modal.common.cancel'),
                                    onClick: onClose,
                                    kind: 'link',
                                    disabled: waitingOnContinue,
                                },
                                continue: {
                                    title: I18n.t('modal.common.deploy'),
                                    kind: 'primary',
                                    onClick: onContinue,
                                    spinner: waitingOnContinue,
                                    disabled: waitingOnContinue,
                                },
                            }}
                        />
                    </div>
                )}
            >
                <div className={styles.previewImageWrapper}>
                    <FallbackImage src={image} alt={product.name} className={styles.previewImage} />
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default ConfirmDeployCommunityDialog
