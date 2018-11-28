// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import CheckmarkIcon from '$mp/components/CheckmarkIcon'
import type { TransactionState } from '$mp/flowtype/common-types'
import { transactionStates } from '$mp/utils/constants'
import withI18n from '$mp/containers/WithI18n'
import links from '$mp/../links'
import TxFailedImage from '$mp/assets/tx_failed.png'
import TxFailedImage2x from '$mp/assets/tx_failed@2x.png'
import Dialog from '../Dialog'
import styles from '../CompletePublishDialog/completePublishDialog.pcss'

export type Props = {
    publishState: ?TransactionState,
    onCancel: () => void,
}

const CompleteContractProductPublishDialog = ({ onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completePublish.started.title')}
                    actions={{
                        cancel: {
                            title: I18n.t('modal.common.cancel'),
                            onClick: onCancel,
                            color: 'link',
                        },
                        publish: {
                            title: I18n.t('modal.common.waiting'),
                            color: 'primary',
                            disabled: true,
                            spinner: true,
                        },
                    }}
                >
                    <div>
                        <p><Translate value="modal.completePublish.started.message" dangerousHTML /></p>
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completePublish.pending.title')}
                >
                    <div>
                        <Spinner size="large" className={styles.icon} />
                        <Translate tag="p" value="modal.common.waitingForBlockchain" marketplaceLink={links.main} dangerousHTML />
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completePublish.confirmed.title')}
                    autoClose
                >
                    <div>
                        <CheckmarkIcon size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completePublish.failed.title')}
                >
                    <div>
                        <img
                            className={styles.icon}
                            src={TxFailedImage}
                            srcSet={`${TxFailedImage2x} 2x`}
                            alt={I18n.t('error.txFailed')}
                        />
                        <p><Translate value="modal.completePublish.failed.message" dangerousHTML /></p>
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default withI18n(CompleteContractProductPublishDialog)
