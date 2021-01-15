// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
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
                title={I18n.t(`modal.publishError.${failedAction === 'allFailed' ? 'allFailed' : 'someFailed'}.title`, {
                    publishMode: I18n.t(`modal.publishError.publishModes.${publishMode}`),
                })}
            >
                <div>
                    <StyledPngIcon
                        name="publishFailed"
                        alt={I18n.t('error.publishFailed')}
                    />
                    <p>
                        {!!failedAction && (
                            <Translate value={`modal.publishError.actions.${failedAction}`} />
                        )}
                        &nbsp;
                        <Translate value="modal.publishError.actions.checkWallet" />
                    </p>
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default PublishError
