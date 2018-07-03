// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import Dialog from '../Dialog'
import Spinner from '../../Spinner'
import CheckmarkIcon from '../../CheckmarkIcon'
import WalletErrorIcon from '../../../components/WalletErrorIcon'
import type { TransactionState } from '../../../flowtype/common-types'
import { transactionStates } from '../../../utils/constants'
import withI18n from '../../../containers/WithI18n'

import styles from '../modal.pcss'

export type Props = {
    publishState: ?TransactionState,
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const CompleteUnpublishDialog = ({ onCancel, publishState, translate }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={translate('modal.completePurchase.started.title')}
                    actions={{
                        cancel: {
                            title: translate('modal.common.cancel'),
                            onClick: onCancel,
                        },
                        publish: {
                            title: translate('modal.common.waiting'),
                            color: 'primary',
                            disabled: true,
                            spinner: true,
                        },
                    }}
                >
                    <div>
                        <p><Translate value="modal.completePurchase.started.message" dangerousHTML /></p>
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onCancel}
                    title={translate('modal.completePurchase.pending.title')}
                >
                    <div>
                        <Spinner size="large" className={styles.icon} />
                        <p><Translate value="modal.completePurchase.pending.message" /></p>
                    </div>
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={translate('modal.completePurchase.confirmed.title')}
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
                    title={translate('modal.completePurchase.failed.title')}
                >
                    <div>
                        <WalletErrorIcon />
                        <p><Translate value="modal.completePurchase.failed.message" dangerousHTML /></p>
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default withI18n(CompleteUnpublishDialog)
