import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import PngIcon from '$shared/components/PngIcon'
import { transactionStates } from '$shared/utils/constants'

const StyledPngIcon = styled(PngIcon)`
    margin: 0.5rem 0 2.5rem;
`

const UnstyledWhitelistEditErrorDialog = ({ publishMode, status, onClose, ...props }) => {
    const failedAction = useMemo(() => {
        const keys = Object.keys(status)
        const failed = keys.filter((key) => status[key] === transactionStates.FAILED)

        let mode

        if (failed.length === keys.length) {
            mode = 'allFailed'
        } else if (failed.length === 1) {
            const [firstFailed] = failed
            mode = firstFailed
        } else if (failed.length > 1) {
            mode = 'someFailed'
        }

        return mode
    }, [status])

    return (
        <ModalPortal>
            <Dialog
                onClose={onClose}
                title={I18n.t(`modal.whiteListEdit.${failedAction === 'allFailed' ? 'allFailed' : 'someFailed'}.title`)}
                {...props}
            >
                <div>
                    <StyledPngIcon
                        name="txFailed"
                        alt={I18n.t('error.txFailed')}
                    />
                    <p>
                        {!!failedAction && (
                            <Translate value={`modal.whiteListEdit.errors.${failedAction}`} />
                        )}
                        &nbsp;
                        <Translate value="modal.whiteListEdit.errors.checkWallet" />
                    </p>
                </div>
            </Dialog>
        </ModalPortal>
    )
}

const WhitelistEditErrorDialog = styled(UnstyledWhitelistEditErrorDialog)``

export default WhitelistEditErrorDialog
