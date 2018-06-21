// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import Dialog from '../Dialog'
import Spinner from '../../Spinner'
import CheckmarkIcon from '../../CheckmarkIcon'
import WalletErrorIcon from '../../../components/WalletErrorIcon'
import { transactionStates } from '../../../utils/constants'
import links from '../../../links'
import type { TransactionState } from '../../../flowtype/common-types'
import withI18n from '../../../containers/WithI18n'

import styles from '../modal.pcss'

export type Props = {
    purchaseState: ?TransactionState,
    accountLinked: boolean,
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

const CompletePurchaseDialog = ({ onCancel, purchaseState, accountLinked, translate }: Props) => {
    switch (purchaseState) {
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
                        {!accountLinked && (
                            <p><Translate value="modal.completePurchase.confirmed.message" profileLink={links.profile} dangerousHTML /></p>
                        )}
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

CompletePurchaseDialog.defaultProps = {
    accountLinked: true,
}

export default withI18n(CompletePurchaseDialog)
