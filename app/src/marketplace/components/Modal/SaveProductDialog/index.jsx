// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import Dialog from '../Dialog'
import Spinner from '$mp/components/Spinner'
import CheckmarkIcon from '$mp/components/CheckmarkIcon'
import WalletErrorIcon from '$mp/components/WalletErrorIcon'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import withI18n from '$mp/containers/WithI18n'

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
