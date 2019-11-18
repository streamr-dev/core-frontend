// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import Spinner from '$shared/components/Spinner'
import WalletErrorIcon from '$mp/components/WalletErrorIcon'
import SvgIcon from '$shared/components/SvgIcon'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'

import styles from '$mp/components/Modal/modal.pcss'

export type Props = {
    transactionState: ?TransactionState,
    onClose: () => void,
}

const SaveProductDialog = ({ transactionState, onClose }: Props) => {
    switch (transactionState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onClose}
                    title={I18n.t('modal.saveProduct.started.title')}
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
                    title={I18n.t('modal.saveProduct.confirmed.title')}
                >
                    <div>
                        <SvgIcon name="checkmark" size="large" className={styles.icon} />
                    </div>
                </Dialog>
            )

        case transactionStates.FAILED:
            return (
                <Dialog
                    onClose={onClose}
                    title={I18n.t('modal.saveProduct.failed.title')}
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

export default SaveProductDialog
