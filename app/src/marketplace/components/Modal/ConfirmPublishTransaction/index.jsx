// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import links from '$mp/../links'
import Dialog from '$shared/components/Dialog'
import styles from '../CompletePublishDialog/completePublishDialog.pcss'

export type Props = {
    waiting?: boolean,
    publishState: ?TransactionState,
    onCancel: () => void,
}

const ConfirmPublishTransaction = ({ waiting, onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    waiting={waiting}
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
                        <Translate tag="p" value="modal.common.waitingForBlockchain" marketplaceLink={links.marketplace.main} dangerousHTML />
                    </div>
                </Dialog>
            )

        default:
            return (
                <Dialog
                    waiting
                    onClose={onCancel}
                />
            )
    }
}

export default ConfirmPublishTransaction
