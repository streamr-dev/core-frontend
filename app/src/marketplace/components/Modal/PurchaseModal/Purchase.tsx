import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Dialog from '$shared/components/Dialog'
import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    onClose?: () => void,
    onConfirm: () => void,
}

const Purchase = ({ onClose, onConfirm }: Props) => {
    const confirmInProcess = useRef(false)

    // We want to start processing allowance without user clicking button.
    // The ref dance is needed for making sure we run it only once.
    useEffect(() => {
        if (confirmInProcess.current) {
            return
        }
        confirmInProcess.current = true
        onConfirm()
    }, [onConfirm])

    return (
        <Dialog
            title="Payment confirmation"
            onClose={onClose}
            actions={{
                pay: {
                    title: 'Waiting',
                    kind: 'primary',
                    spinner: true,
                },
            }}
            useDarkBackdrop
            closeOnEsc={false}
            closeOnBackdropClick={false}
            centerTitle
        >
            You need to confirm the transaction in your<br />
            wallet to access this project
        </Dialog>
    )
}

export default Purchase
