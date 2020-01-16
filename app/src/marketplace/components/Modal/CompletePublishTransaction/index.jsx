// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import SvgIcon from '$shared/components/SvgIcon'
import Spinner from '$shared/components/Spinner'
import { transactionStates } from '$shared/utils/constants'

import styles from './completePublishTransaction.pcss'

export type Status = {
    [string]: string,
}

export type Props = {
    isUnpublish: ?boolean,
    status: Status,
    onCancel: () => void,
}

const CompletePublishTransaction = ({ isUnpublish, onCancel, status }: Props) => {
    const { somePending, someFailed, allConfirmed } = useMemo(() => {
        const statuses = Object.values(status)
        const pending = statuses.some((value) => value !== transactionStates.FAILED && value !== transactionStates.CONFIRMED)
        return {
            somePending: pending,
            someFailed: !pending && statuses.some((value) => value === transactionStates.FAILED),
            allConfirmed: !pending && statuses.every((value) => value === transactionStates.CONFIRMED),
        }
    }, [status])

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={I18n.t(`modal.complete${isUnpublish ? 'Unpublish' : 'Publish'}.started.title`)}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: onCancel,
                        kind: 'link',
                    },
                    close: {
                        title: somePending ? I18n.t('modal.common.waiting') : I18n.t('modal.common.close'),
                        kind: 'primary',
                        disabled: somePending,
                        spinner: somePending,
                        onClick: onCancel,
                    },
                }}
            >
                <div className={styles.statusArray}>
                    {Object.keys(status).map((key) => (
                        <div key={key} className={styles.statusRow}>
                            <div className={styles.iconBox}>
                                {status[key] === transactionStates.FAILED && (
                                    <SvgIcon name="error" className={cx(styles.icon, styles.iconSize)} />
                                )}
                                {status[key] === transactionStates.CONFIRMED && (
                                    <SvgIcon name="checkmark" size="small" className={styles.icon} />
                                )}
                                {status[key] !== transactionStates.FAILED && status[key] !== transactionStates.CONFIRMED && (
                                    <Spinner size="small" className={cx(styles.spinner, styles.iconSize)} />
                                )}
                            </div>
                            <div>
                                <Translate
                                    value={`modal.completePublish.${key}.started.title`}
                                    tag="p"
                                    dangerousHTML
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {!!somePending && (
                    <Translate
                        value="modal.common.waitingForBlockchain"
                        tag="p"
                        dangerousHTML
                    />
                )}
                {!!someFailed && !isUnpublish && (
                    <Translate
                        value="modal.completePublish.failed.message"
                        tag="p"
                        dangerousHTML
                    />
                )}
                {!!someFailed && isUnpublish && (
                    <Translate
                        value="modal.completeUnpublish.failed.message"
                        tag="p"
                        dangerousHTML
                    />
                )}
                {!!allConfirmed && !isUnpublish && (
                    <Translate
                        value="modal.completePublish.confirmed.title"
                        tag="p"
                        dangerousHTML
                    />
                )}
                {!!allConfirmed && isUnpublish && (
                    <Translate
                        value="modal.completeUnpublish.confirmed.title"
                        tag="p"
                        dangerousHTML
                    />
                )}
            </Dialog>
        </ModalPortal>
    )
}

export default CompletePublishTransaction
