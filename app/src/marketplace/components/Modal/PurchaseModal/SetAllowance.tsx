import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { COLORS } from '$shared/utils/styled'
import SvgIcon from '$shared/components/SvgIcon'
import routes from '$routes'
import { DialogContainer, DialogTitle, NextButton } from './styles'

const Box = styled.div`
    background: #FFFFFF;
    border-radius: 8px;
    padding: 32px 24px;
    font-size: 16px;
    line-height: 24px;
`

const Header = styled.div`
    height: 56px;
`

const Help = styled.div`
    display: grid;
    grid-template-columns: 18px 1fr;
    background: ${COLORS.secondary};
    border-radius: 8px;
    padding: 20px 16px;
    font-size: 16px;
    line-height: 24px;
    gap: 12px;
`

type Props = {
    visible: boolean,
    tokenSymbol: string,
    onConfirm: () => void,
}

const SetAllowance = ({ visible, tokenSymbol, onConfirm }: Props) => {
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
            <Box>
                <Header>This step allows the Hub to transfer the required amount of {tokenSymbol}.</Header>
                <Help>
                    <SvgIcon name='outlineQuestionMark2' />
                    <div>
                        Allowance is a requirement of ERC-20 token transfers, designed to increase security and efficiency.
                        For more about allowances, see this
                        {' '}
                        <a href={routes.allowanceInfo()} target="_blank" rel="noopener noreferrer">
                            page
                        </a>
                        .
                    </div>
                </Help>
            </Box>
            <NextButton
                waiting
            >
                Waiting
            </NextButton>
        </DialogContainer>
    )
}

export default SetAllowance
