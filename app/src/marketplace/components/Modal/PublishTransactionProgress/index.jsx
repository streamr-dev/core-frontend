// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ProgressBar from '$shared/components/ProgressBar'
import { transactionStates } from '$shared/utils/constants'

import styles from './publishTransactionProgress.pcss'

export type Status = {
    [string]: string,
}

export type Props = {
    isUnpublish: ?boolean,
    status: Status,
    onCancel: () => void,
}

const PendingTasks = styled.div`
    color: #A3A3A3;
    font-size: 1rem;
    line-height: 1.5rem;
    width: 100%;
    min-height: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:not(:empty)::after {
        content: '...';
    }
`

const FailedTasks = styled.div`
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
    color: #FF5C00;
    margin-top: 0.5rem;
`

const PublishTransactionProgress = ({ isUnpublish, onCancel, status }: Props) => {
    const { somePending, someFailed, allConfirmed } = useMemo(() => {
        const statuses = Object.values(status)
        const pending = statuses.some((value) => value !== transactionStates.FAILED && value !== transactionStates.CONFIRMED)
        return {
            somePending: pending,
            someFailed: !pending && statuses.some((value) => value === transactionStates.FAILED),
            allConfirmed: !pending && statuses.every((value) => value === transactionStates.CONFIRMED),
        }
    }, [status])

    const progress = useMemo(() => Object.keys(status).reduce((result, key) => {
        const value = status[key]

        if (value === transactionStates.PENDING) {
            result.pending.push(key)
        }

        if (value === transactionStates.FAILED || value === transactionStates.CONFIRMED) {
            result.complete.push(key)
        }

        if (value === transactionStates.FAILED) {
            result.failed.push(key)
        }

        if (value === transactionStates.CONFIRMED) {
            result.confirmed.push(key)
        }

        return result
    }, {
        pending: [],
        complete: [],
        failed: [],
        confirmed: [],
    }), [status])

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={I18n.t(`modal.complete${isUnpublish ? 'Unpublish' : 'Publish'}.started.title`)}
                titleClassName={somePending ? styles.titlePending : undefined}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: () => onCancel(),
                        kind: 'link',
                        disabled: somePending,
                    },
                    close: {
                        title: somePending ? I18n.t('modal.common.working') : I18n.t('modal.common.close'),
                        kind: 'primary',
                        disabled: somePending,
                        onClick: () => onCancel(),
                    },
                }}
            >
                <div className={styles.publishProgress}>
                    <PendingTasks>
                        {progress.pending && progress.pending.length > 0 && progress.pending.map((key) => (
                            I18n.t(`modal.completePublish.${key}.pending`)
                        )).join(', ')}
                    </PendingTasks>
                    <ProgressBar value={(progress.complete.length / Math.max(1, Object.keys(status).length)) * 100} />
                    <FailedTasks>
                        {progress.failed && progress.failed.length > 0 && progress.failed.map((key) => (
                            I18n.t(`modal.completePublish.${key}.failed`)
                        )).join(', ')}
                    </FailedTasks>
                </div>
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

export default PublishTransactionProgress
