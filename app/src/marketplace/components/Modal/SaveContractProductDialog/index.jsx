// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import CheckmarkIcon from '$mp/components/CheckmarkIcon'
import WalletErrorIcon from '$mp/components/WalletErrorIcon'
import type { TransactionState } from '$mp/flowtype/common-types'
import { transactionStates } from '$mp/utils/constants'
import withI18n from '$mp/containers/WithI18n'
import links from '$mp/../links'
import Dialog from '../Dialog'

import styles from '../modal.pcss'

export type Props = {
    transactionState: ?TransactionState,
    onClose: () => void,
    translate: (key: string, options: any) => string,
}

const SaveContractProductDialog = ({ transactionState, onClose, translate }: Props) => {
    switch (transactionState) {
        case transactionStates.STARTED:
            return (
                <Dialog
                    onClose={onClose}
                    title={translate('modal.saveProduct.started.title')}
                    actions={{
                        cancel: {
                            title: translate('modal.common.cancel'),
                            onClick: onClose,
                            outline: true,
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
                        <p><Translate value="modal.saveProduct.started.message" dangerousHTML /></p>
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

export default withI18n(SaveContractProductDialog)
