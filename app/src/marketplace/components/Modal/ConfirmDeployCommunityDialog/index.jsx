// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'
import { type Product } from '$mp/flowtype/product-types'

import styles from './confirmDeployCommunityDialog.pcss'

export type Props = {
    product: Product,
    onClose: () => void,
    onContinue: () => void,
    onShowGuidedDialog: () => void,
}

const ConfirmDeployCommunityDialog = ({ product, onClose, onContinue, onShowGuidedDialog }: Props) => {
    // $FlowFixMe
    const image = String((product.newImageToUpload && product.newImageToUpload.preview) || product.imageUrl)

    return (
        <Modal>
            <Dialog
                className={cx(styles.root, styles.ConfirmDeployCommunityDialog)}
                title={product.name}
                onClose={onClose}
                contentClassName={styles.content}
                renderActions={() => (
                    <div className={styles.footer}>
                        <div className={styles.footerText}>
                            Learn about <a href="#" onClick={onShowGuidedDialog}>deploying drafts</a>
                        </div>
                        <Buttons
                            actions={{
                                cancel: {
                                    title: I18n.t('modal.common.cancel'),
                                    onClick: onClose,
                                    color: 'link',
                                },
                                continue: {
                                    title: I18n.t('modal.common.deploy'),
                                    color: 'primary',
                                    onClick: onContinue,
                                },
                            }}
                        />
                    </div>
                )}
            >
                <div
                    className={styles.previewImage}
                    style={{
                        backgroundImage: `url('${image}')`,
                    }}
                />
            </Dialog>
        </Modal>
    )
}

export default ConfirmDeployCommunityDialog
