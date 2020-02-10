// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import links from '$mp/../links'
import PngIcon from '$shared/components/PngIcon'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import styles from '../modal.pcss'

export type Props = {
    publishState: ?TransactionState,
    onCancel: () => void,
}

const CompleteContractProductPublishDialog = ({ onCancel, publishState }: Props) => {
    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <ModalPortal>
                    <Dialog
                        onClose={onCancel}
                        title={I18n.t('modal.completePublish.started.title')}
                        actions={{
                            cancel: {
                                title: I18n.t('modal.common.cancel'),
                                onClick: onCancel,
                                kind: 'link',
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
                            <p><Translate value="modal.completePublish.started.message" dangerousHTML /></p>
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        case transactionStates.PENDING:
            return (
                <ModalPortal>
                    <Dialog
                        onClose={onCancel}
                        title={I18n.t('modal.completePublish.pending.title')}
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
                        onClose={onCancel}
                        title={I18n.t('modal.completePublish.confirmed.title')}
                        autoClose
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
                        onClose={onCancel}
                        title={I18n.t('modal.completePublish.failed.title')}
                    >
                        <div>
                            <PngIcon
                                className={styles.icon}
                                name="publishFailed"
                                alt={I18n.t('error.publishFailed')}
                            />
                            <Translate value="modal.completePublish.failed.message" dangerousHTML tag="p" />
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        default:
            return null
    }
}

export default CompleteContractProductPublishDialog
