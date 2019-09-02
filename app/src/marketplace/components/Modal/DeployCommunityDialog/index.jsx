// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import Buttons from '$shared/components/Buttons'

import styles from './deployCommunityDialog.pcss'

export type Props = {
    onClose: () => void,
}

const DeployCommunityDialog = ({ onClose }: Props) => (
    <Modal>
        <Dialog
            className={cx(styles.root, styles.DeployCommunityDialog)}
            title={I18n.t('modal.confirmNoCoverImage.title')}
            onClose={onClose}
            contentClassName={styles.content}
            renderActions={() => (
                <div className={styles.footer}>
                    <div className={styles.footerText}>
                        Learn about deploying products
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
                                onClick: () => {},
                            },
                        }}
                    />
                </div>
            )}
        >
            sasd
            <p><Translate value="modal.confirmNoCoverImage.message" dangerousHTML /></p>
        </Dialog>
    </Modal>
)

export default DeployCommunityDialog
