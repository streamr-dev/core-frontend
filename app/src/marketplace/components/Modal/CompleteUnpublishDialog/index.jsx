// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import PngIcon from '$shared/components/PngIcon'
import ModalPortal from '$shared/components/ModalPortal'
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
                <ModalPortal>
                    <Dialog
                        onClose={onCancel}
                        title={I18n.t('modal.readyToUnpublish.title')}
                    >
                        <div>
                            <Spinner size="large" className={styles.icon} />
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        case transactionStates.CONFIRMED:
            return (
                <ModalPortal>
                    <Dialog
                        onClose={onCancel}
                        title={I18n.t('modal.completeUnpublish.confirmed.title')}
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
                        title={I18n.t('modal.completeUnpublish.failed.title')}
                    >
                        <div>
                            <PngIcon
                                className={styles.icon}
                                name="txFailed"
                                alt={I18n.t('error.txFailed')}
                            />
                            <p><Translate value="modal.completeUnpublish.failed.message" dangerousHTML /></p>
                        </div>
                    </Dialog>
                </ModalPortal>
            )

        default:
            return null
    }
}

export default CompleteUnpublishDialog
