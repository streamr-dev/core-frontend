// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

import Dialog from '../Dialog/index'
import Spinner from '../../Spinner/index'
import CheckmarkIcon from '../../CheckmarkIcon/index'
import WalletErrorIcon from '../../WalletErrorIcon/index'
import { transactionStates } from '../../../../../../marketplace/src/utils/constants'
import links from '../../../../../../marketplace/src/links'
import type { TransactionState } from '../../../../../../marketplace/src/flowtype/common-types'
import withI18n from '../../../../../../marketplace/src/containers/WithI18n/index'

import modalStyles from '../modal.pcss'
import styles from './completePurchaseDialog.pcss'

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
                    <Spinner size="large" className={modalStyles.icon} />
                    <Translate
                        tag="p"
                        value="modal.common.waitingForBlockchain"
                        marketplaceLink={links.main}
                        className={styles.pendingText}
                        dangerousHTML
                    />
                </Dialog>
            )

        case transactionStates.CONFIRMED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={translate('modal.completePurchase.confirmed.title')}
                >
                    <CheckmarkIcon size="large" className={modalStyles.icon} />
                    {!accountLinked && (
                        <Translate
                            tag="p"
                            value="modal.completePurchase.confirmed.message"
                            profileLink={links.profile}
                            dangerousHTML
                        />
                    )}
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onCancel}
                    title={translate('modal.completePurchase.failed.title')}
                >
                    <WalletErrorIcon />
                    <Translate
                        tag="p"
                        value="modal.completePurchase.failed.message"
                        dangerousHTML
                    />
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
