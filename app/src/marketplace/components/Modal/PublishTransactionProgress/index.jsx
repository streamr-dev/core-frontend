// @flow

import React, { useMemo } from 'react'
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

const modalTitles = {
    publish: 'Publishing',
    redeploy: 'Publishing',
    republish: 'Republishing',
    unpublish: 'Unpublishing',
    error: 'Error',
}

const pendingTitles = {
    updateContractProduct: 'Updating product',
    createContractProduct: 'Publishing',
    publishPaid: 'Republishing',
    updateAdminFee: 'Updating data union',
    undeployContractProduct: 'Unpublishing',
    publishFree: 'Publishing',
    unpublishFree: 'Unpublishing',
    publishPendingChanges: 'Updating product',
    setRequiresWhitelist: 'Updating whitelist status',
}

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
                title={publishMode && modalTitles[publishMode]}
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: () => onCancel(),
                        kind: 'link',
                        disabled: true,
                    },
                    close: {
                        title: 'Working',
                        kind: 'primary',
                        disabled: true,
                        onClick: () => onCancel(),
                    },
                }}
            >
                <PublishProgress>
                    <PendingTasks isPrompted={isPrompted}>
                        {pending.length > 0 && pending.map((key) => pendingTitles[key]).join(', ')}
                    </PendingTasks>
                    <ProgressBar value={((progress + 1) / ((Object.keys(status).length * 2) + 1)) * 100} />
                </PublishProgress>
            </Dialog>
        </ModalPortal>
    )
}

export default PublishTransactionProgress
