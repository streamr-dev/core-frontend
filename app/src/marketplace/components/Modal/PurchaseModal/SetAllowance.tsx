import React, { useEffect } from 'react'
import styled from 'styled-components'

import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    visible: boolean,
    onConfirm: () => void,
}

const SetAllowance = ({ visible, onConfirm }: Props) => {
    useEffect(() => {
        if (visible) {
            // Fire allowance setting process straight away without user needing to click the button
            onConfirm()
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
