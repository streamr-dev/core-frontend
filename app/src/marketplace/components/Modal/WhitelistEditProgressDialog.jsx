import React, { useMemo } from 'react'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ProgressBar from '$shared/components/ProgressBar'
import { transactionStates } from '$shared/utils/constants'

import PendingTasks from './PendingTasks'

const PublishProgress = styled.div`
    width: 100%;
`

const actions = {
    setRequiresWhitelist: 'Enabling whitelist',
    addWhiteListAddress: 'Adding address',
    removeWhiteListAddress: 'Removing address',
}

const UnstyledWhitelistEditProgressDialog = ({ onCancel, status, isPrompted, ...props }) => {
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
                {...props}
                onClose={onCancel}
                title="Updating whitelist..."
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
                        {pending.length > 0 && pending.map((key) => actions[key]).join(', ')}
                    </PendingTasks>
                    <ProgressBar value={((progress + 1) / ((Object.keys(status).length * 2) + 1)) * 100} />
                </PublishProgress>
            </Dialog>
        </ModalPortal>
    )
}

const WhitelistEditProgressDialog = styled(UnstyledWhitelistEditProgressDialog)``

export default WhitelistEditProgressDialog
