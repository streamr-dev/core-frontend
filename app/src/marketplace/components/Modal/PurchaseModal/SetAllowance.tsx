import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    visible: boolean,
    onConfirm: () => void,
}

const SetAllowance = ({ visible, onConfirm }: Props) => {
    const confirmInProcess = useRef(false)

    // We want to start processing allowance without user clicking button.
    // The ref dance is needed for making sure we run it only once.
    useEffect(() => {
        if (visible) {
            if (confirmInProcess.current) {
                return
            }
            confirmInProcess.current = true
            onConfirm()
        } else {
            confirmInProcess.current = false
        }
    }, [onConfirm, visible])

    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <DialogTitle>Set Streamr Hub allowance</DialogTitle>
            <div>test</div>
            <NextButton
                waiting
            >
                Waiting
            </NextButton>
        </DialogContainer>
    )
}

export default SetAllowance
