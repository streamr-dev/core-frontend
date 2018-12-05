// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import CheckmarkIcon from '$mp/components/CheckmarkIcon'
import type { TransactionState } from '$mp/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import TxFailedImage from '$mp/assets/tx_failed.png'
import TxFailedImage2x from '$mp/assets/tx_failed@2x.png'
import Dialog from '$shared/components/Dialog'

import styles from './completeUnpublishDialog.pcss'

export type Props = {
    publishState: ?TransactionState,
    onCancel: () => void,
}

const CompleteUnpublishDialog = ({ onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.readyToUnpublish.title')}
                >
                    <div>
                        <Spinner size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={I18n.t('modal.completeUnpublish.confirmed.title')}
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
                    title={I18n.t('modal.completeUnpublish.failed.title')}
                >
                    <div>
                        <img
                            className={styles.icon}
                            src={TxFailedImage}
                            srcSet={`${TxFailedImage2x} 2x`}
                            alt={I18n.t('error.txFailed')}
                        />
                        <p><Translate value="modal.completeUnpublish.failed.message" dangerousHTML /></p>
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default CompleteUnpublishDialog
