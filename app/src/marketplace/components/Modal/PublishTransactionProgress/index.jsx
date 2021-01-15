// @flow

import React, { useMemo } from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ProgressBar from '$shared/components/ProgressBar'
import { transactionStates } from '$shared/utils/constants'
import type { PublishMode } from '$mp/containers/EditProductPage/usePublish'

import PendingTasks from '../PendingTasks'

export type Status = {
    [string]: string,
}

export type Props = {
    publishMode: PublishMode,
    status: Status,
    onCancel: () => void,
    isPrompted?: boolean,
}

const PublishProgress = styled.div`
    width: 100%;
`

const PublishTransactionProgress = ({ publishMode, onCancel, status, isPrompted }: Props) => {
    const { pending, progress } = useMemo(() => Object.keys(status).reduce((result, key) => {
        const value = status[key]

        if (value === transactionStates.PENDING) {
            return {
                ...result,
                pending: [
                    ...result.pending,
                    key,
                ],
                progress: result.progress + 1,
            }
        }

        if (value === transactionStates.FAILED || value === transactionStates.CONFIRMED) {
            return {
                ...result,
                progress: result.progress + 2,
            }
        }

        return result
    }, {
        pending: [],
        progress: 0,
    }), [status])

    return (
        <ModalPortal>
            <Dialog
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
                        {pending.length > 0 && pending.map((key) => (
                            I18n.t(`modal.publishProgress.${key}.pending`)
                        )).join(', ')}
                    </PendingTasks>
                    <ProgressBar value={((progress + 1) / ((Object.keys(status).length * 2) + 1)) * 100} />
                </PublishProgress>
            </Dialog>
        </ModalPortal>
    )
}

export default PublishTransactionProgress
