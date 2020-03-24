// @flow

import React, { useMemo } from 'react'
import { I18n } from 'react-redux-i18n'
import styled, { css } from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ProgressBar from '$shared/components/ProgressBar'
import { transactionStates } from '$shared/utils/constants'
import type { PublishMode } from '$mp/containers/EditProductPage/usePublish'

export type Status = {
    [string]: string,
}

export type Props = {
    publishMode: PublishMode,
    status: Status,
    onCancel: () => void,
    isPrompted?: boolean,
}

const StyledDialog = styled(Dialog)`
    ${({ isPrompted }) => !!isPrompted && css`
        .${Dialog.classNames.title} {
            opacity: 0.5;
        }
    `}
`

const PublishProgress = styled.div`
    width: 100%;
`

const PendingTasks = styled.div`
    color: ${({ isPrompted }) => (isPrompted ? '#FF5C00' : '#A3A3A3')};
    font-size: 1rem;
    line-height: 1.5rem;
    width: 100%;
    min-height: 1.5rem;
    margin-bottom: 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${({ isPrompted }) => !isPrompted && css`
        &:not(:empty)::after {
            content: '...';
        }
    `}
`

const FailedTasks = styled.div`
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
    color: #FF5C00;
    margin-top: 0.5rem;
    min-height: 1.5rem;
    line-height: 1.5rem;
`

const PublishTransactionProgress = ({ publishMode, onCancel, status, isPrompted }: Props) => {
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
            <StyledDialog
                isPrompted={isPrompted}
                onClose={onCancel}
                title={I18n.t(`modal.publishProgress.${publishMode}.title`)}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: () => onCancel(),
                        kind: 'link',
                        disabled: true,
                    },
                    close: {
                        title: I18n.t('modal.common.working'),
                        kind: 'primary',
                        disabled: true,
                        onClick: () => onCancel(),
                    },
                }}
            >
                <PublishProgress>
                    <PendingTasks isPrompted={isPrompted}>
                        {!!isPrompted && (
                            'Requires wallet confirmation'
                        )}
                        {!isPrompted && progress.pending && progress.pending.length > 0 && progress.pending.map((key) => (
                            I18n.t(`modal.publishProgress.${key}.pending`)
                        )).join(', ')}
                    </PendingTasks>
                    <ProgressBar value={(progress.complete.length / Math.max(1, Object.keys(status).length)) * 100} />
                    <FailedTasks>
                        {progress.failed && progress.failed.length > 0 && progress.failed.map((key) => (
                            I18n.t(`modal.publishProgress.${key}.failed`)
                        )).join(', ')}
                    </FailedTasks>
                </PublishProgress>
            </StyledDialog>
        </ModalPortal>
    )
}

export default PublishTransactionProgress
