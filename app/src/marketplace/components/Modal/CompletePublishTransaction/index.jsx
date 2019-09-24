// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'

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
    const somePending = useMemo(() => (
        Object.values(status).some((value) => value !== transactionStates.FAILED && value !== transactionStates.CONFIRMED)
    ), [status])

    return (
        <Dialog
            onClose={onCancel}
            title={I18n.t(`modal.complete${isUnpublish ? 'Unpublish' : 'Publish'}.started.title`)}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    onClick: onCancel,
                    color: 'link',
                },
                close: {
                    title: somePending ? I18n.t('modal.common.waiting') : I18n.t('modal.common.close'),
                    color: 'primary',
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
        </Dialog>
    )
}

export default CompletePublishTransaction
