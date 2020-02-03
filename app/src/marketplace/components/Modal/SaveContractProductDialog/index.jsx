// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import WalletErrorIcon from '$mp/components/WalletErrorIcon'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import links from '$mp/../links'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'

import styles from '../modal.pcss'

export type Props = {
    transactionState: ?TransactionState,
    onClose: () => void,
}

const SaveContractProductDialog = ({ transactionState, onClose }: Props) => {
    switch (transactionState) {
        case transactionStates.STARTED:
            return (
                <ModalPortal>
                    <Dialog
                        onClose={onClose}
                        title={I18n.t('modal.saveProduct.started.title')}
                        actions={{
                            cancel: {
                                title: I18n.t('modal.common.cancel'),
                                kind: 'link',
                                onClick: onClose,
                                outline: true,
                            },
                            publish: {
                                title: I18n.t('modal.common.waiting'),
                                kind: 'primary',
                                disabled: true,
                                spinner: true,
                            },
                        }}
                    >
                        <div>
                            <p><Translate value="modal.saveProduct.started.message" dangerousHTML /></p>
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        case transactionStates.PENDING:
            return (
                <ModalPortal>
                    <Dialog
                        onClose={onClose}
                        title={I18n.t('modal.saveProduct.pending.title')}
                    >
                        <div>
                            <Spinner size="large" className={styles.icon} />
                            <Translate tag="p" value="modal.common.waitingForBlockchain" marketplaceLink={links.marketplace.main} dangerousHTML />
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        case transactionStates.CONFIRMED:
            return (
                <ModalPortal>
                    <Dialog
                        onClose={onClose}
                        title={I18n.t('modal.saveProduct.confirmed.title')}
                    >
                        <div>
                            <SvgIcon name="checkmark" size="large" className={styles.icon} />
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        case transactionStates.FAILED:
            return (
                <ModalPortal>
                    <Dialog
                        onClose={onClose}
                        title={I18n.t('modal.saveProduct.failed.title')}
                    >
                        <div>
                            <WalletErrorIcon />
                            <Translate tag="p" value="modal.saveProduct.failed.message" dangerousHTML />
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        default:
            return null
    }
}

export default SaveContractProductDialog
