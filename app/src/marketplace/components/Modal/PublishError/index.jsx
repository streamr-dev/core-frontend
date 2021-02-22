// @flow

import React, { useMemo } from 'react'
import styled from 'styled-components'

import { type PublishMode } from '$mp/containers/EditProductPage/usePublish'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'
import { transactionStates } from '$shared/utils/constants'

export type Status = {
    [string]: string,
}

export type Props = {
    onClose: () => void,
    publishMode: PublishMode,
    status: Status,
}

const StyledPngIcon = styled(PngIcon)`
    margin: 0.5rem 0 2.5rem;
`

const publishModes = {
    publish: 'Publishing',
    republish: 'Republishing',
    redeploy: 'Publishing',
    unpublish: 'Unpublishing',
    error: '',
}

const actions = {
    updateAdminFee: 'The admin fee failed to update.',
    updateContractProduct: 'The product data failed to update.',
    createContractProduct: 'Failed to publish product.',
    publishPaid: 'Failed to publish product.',
    publishFree: 'Failed to publish product.',
    publishPendingChanges: 'Failed to publish product changes.',
    setRequiresWhitelist: 'Failed to publish product whitelist status.',
    unpublishFree: 'Failed to unpublish product.',
    undeployContractProduct: 'Failed to unpublish product.',
    allFailed: 'The product failed to update.',
    someFailed: 'More than one transaction failed.',
}

const PublishError = ({ publishMode, status, onClose }: Props) => {
    const failedAction = useMemo(() => {
        const keys = Object.keys(status)
        const failed = keys.filter((key) => status[key] === transactionStates.FAILED)

        if (failed.length === keys.length) {
            return 'allFailed'
        } else if (failed.length === 1) {
            return failed[0]
        } else if (failed.length > 1) {
            return 'someFailed'
        }

        return undefined
    }, [status])

    return (
        <ModalPortal>
            <Dialog
                onClose={onClose}
                title={`${publishModes[publishMode]} ${failedAction === 'allFailed' ? 'failed' : 'did not complete'}`}
            >
                <div>
                    <StyledPngIcon
                        name="publishFailed"
                        alt="Publish failed"
                    />
                    <p>
                        {!!failedAction && actions[failedAction]}
                        &nbsp;
                        Please check your wallet or other settings and try again
                    </p>
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default PublishError
