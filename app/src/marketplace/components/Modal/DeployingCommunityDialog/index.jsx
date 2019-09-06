// @flow

import React from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import { type Product } from '$mp/flowtype/product-types'

import styles from './deployingCommunityDialog.pcss'

export type Props = {
    product: Product,
    onClose: () => void,
    onContinue: () => void,
}

// $FlowFixMe
const formatSeconds = (seconds) => new Date(seconds * 1000).toUTCString().match(/\d\d:(\d\d:\d\d)/)[1]

const DeployingCommunityDialog = ({ product, onClose, onContinue }: Props) => {
    const estimate = 205

    return (
        <Modal>
            <Dialog
                className={cx(styles.root, styles.DeployingCommunityDialog)}
                title={I18n.t('modal.deployCommunity.deploying.title', {
                    name: product.name,
                })}
                onClose={onClose}
                contentClassName={styles.content}
                actions={{
                    continue: {
                        title: I18n.t('modal.common.close'),
                        outline: true,
                        onClick: onContinue,
                    },
                }}
            >
                <div className={styles.spinner}>spinner</div>
                <div className={styles.description}>
                    <Translate
                        value="modal.deployCommunity.deploying.description"
                        time={formatSeconds(estimate)}
                        dangerousHTML
                    />
                </div>
            </Dialog>
        </Modal>
    )
}

export default DeployingCommunityDialog
