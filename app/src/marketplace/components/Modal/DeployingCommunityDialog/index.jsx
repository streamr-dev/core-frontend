// @flow

import React from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'

import Modal from '$shared/components/Modal'
import Dialog from '$shared/components/Dialog'
import { type Product } from '$mp/flowtype/product-types'
import DeploySpinner from '$shared/components/DeploySpinner'

import styles from './deployingCommunityDialog.pcss'

export type Props = {
    product: Product,
    estimate: number,
    onClose: () => void,
    onContinue: () => void,
}

const formatSeconds = (seconds) => {
    const timeValue = (new Date(seconds * 1000).toUTCString().match(/\d\d:\d\d:\d\d/) || ['00:00:00'])[0]

    return timeValue.substr(0, 2) === '00' ? timeValue.substr(3) : timeValue
}

const DeployingCommunityDialog = ({ product, estimate, onClose, onContinue }: Props) => (
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
            <div className={styles.spinner}>
                <DeploySpinner isRunning showCounter />
            </div>
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

export default DeployingCommunityDialog
