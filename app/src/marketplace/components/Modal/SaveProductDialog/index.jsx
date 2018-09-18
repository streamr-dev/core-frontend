// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

import Dialog from '../Dialog/index'
import Spinner from '../../Spinner/index'
import CheckmarkIcon from '../../CheckmarkIcon/index'
import WalletErrorIcon from '../../WalletErrorIcon/index'
import type { TransactionState } from '../../../../../../marketplace/src/flowtype/common-types'
import { transactionStates } from '../../../../../../marketplace/src/utils/constants'
import withI18n from '../../../../../../marketplace/src/containers/WithI18n/index'
import links from '../../../../../../marketplace/src/links'

import styles from '../modal.pcss'

export type Props = {
    transactionState: ?TransactionState,
    onClose: () => void,
    translate: (key: string, options: any) => string,
}

const SaveProductDialog = ({ transactionState, onClose, translate }: Props) => {
    switch (transactionState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onClose}
                    title={translate('modal.saveProduct.started.title')}
                >
                    <div>
                        <Spinner size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.PENDING:
            return (
                <Dialog
                    onClose={onClose}
                    title={translate('modal.saveProduct.pending.title')}
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
                    onClose={onClose}
                    title={translate('modal.saveProduct.confirmed.title')}
                >
                    <div>
                        <CheckmarkIcon size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onClose}
                    title={translate('modal.saveProduct.failed.title')}
                >
                    <div>
                        <WalletErrorIcon />
                        <Translate tag="p" value="modal.saveProduct.failed.message" dangerousHTML />
                    </div>
                </Dialog>
            )

        default:
            return null
    }
}

export default withI18n(SaveProductDialog)
