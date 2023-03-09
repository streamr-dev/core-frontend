import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    visible: boolean,
    chainId: number,
    onConfirm: () => void,
}

const SetAllowance = ({ visible, chainId, onConfirm }: Props) => {
    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <DialogTitle>Set Streamr Hub allowance</DialogTitle>
            <div>test</div>
            <NextButton
                onClick={() => onConfirm()}
            >
                Approve
            </NextButton>
        </DialogContainer>
    )
}

export default SetAllowance
