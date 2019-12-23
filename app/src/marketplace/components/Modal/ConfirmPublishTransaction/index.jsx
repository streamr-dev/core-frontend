// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'

import Spinner from '$shared/components/Spinner'
import type { TransactionState } from '$shared/flowtype/common-types'
import { transactionStates } from '$shared/utils/constants'
import links from '$mp/../links'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import { actionsTypes } from '$mp/containers/EditProductPage/publishQueue'

import styles from '../modal.pcss'

export type Props = {
    isUnpublish: ?boolean,
    action: ?string,
    waiting?: boolean,
    publishState: ?TransactionState,
    onCancel: () => void,
}

const ConfirmPublishTransaction = ({
    isUnpublish,
    action,
    waiting,
    onCancel,
    publishState,
}: Props) => {
    const isWaiting = useMemo(() => waiting || [
        actionsTypes.PUBLISH_FREE,
        actionsTypes.UNPUBLISH_FREE,
        actionsTypes.PUBLISH_PENDING_CHANGES,
    ].includes(action), [action, waiting])

    switch (publishState) {
        case transactionStates.STARTED:
            return (
                <ModalPortal>
                    <Dialog
                        waiting={isWaiting}
                        onClose={onCancel}
                        title={I18n.t(`modal.complete${isUnpublish ? 'Unpublish' : 'Publish'}.started.title`)}
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
                            {action && (
                                <Translate
                                    value={`modal.completePublish.${action}.started.message`}
                                    tag="p"
                                    dangerousHTML
                                />
                            )}
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

        default:
            return (
                <ModalPortal>
                    <Dialog
                        waiting
                        onClose={onCancel}
                    />
                </ModalPortal>
            )
    }
}

export default ConfirmPublishTransaction
