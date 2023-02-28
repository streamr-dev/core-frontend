import React, { useState } from 'react'
import styled from 'styled-components'
import NetworkIcon from '$app/src/shared/components/NetworkIcon'
import { TheGraphPaymentDetails } from '$app/src/services/projects'
import { getConfigForChain } from '$app/src/shared/web3/config'
import { Radio as UnstyledRadio } from '$shared/components/Radio'
import { MEDIUM } from '$shared/utils/styled'
import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    visible: boolean,
    paymentDetails: Array<TheGraphPaymentDetails>,
    onNextClicked: (paymentDetails: TheGraphPaymentDetails) => void,
}

const ChainItems = styled.div``

const ChainItem = styled.label`
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 20px 24px;
    width: 100%;
    height: 88px;
    background: #FFFFFF;
    border-radius: 8px;
    cursor: pointer;
`

const ChainIcon = styled(NetworkIcon)`
  width: 40px;
  height: 40px;
`

const Name = styled.span`
    font-size: 18px;
    line-height: 16px;
    font-weight: ${MEDIUM};
`

const Radio = styled(UnstyledRadio)`
    cursor: pointer;
    height: 20px;
`

const SelectChain = ({ visible, paymentDetails, onNextClicked }: Props) => {
    const [selection, setSelection] = useState<TheGraphPaymentDetails | null>(null)

    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <DialogTitle>Select chain for payment token</DialogTitle>
            <ChainItems>
                {Object.values(paymentDetails).map((p) => {
                    const chainId = Number.parseInt(p.domainId)
                    const radioId = `paymentChain-${chainId}`
                    if (!Number.isSafeInteger(chainId)) {
                        console.error("Skipping chain because domainId is not a number", p.domainId)
                    }
                    return (
                        <ChainItem key={chainId} htmlFor={radioId}>
                            <ChainIcon chainId={chainId} />
                            <Name>{getConfigForChain(chainId).name}</Name>
                            <Radio
                                id={radioId}
                                name="paymentChain"
                                value={chainId}
                                label=""
                                checked={selection != null && selection.domainId === chainId.toString()}
                                onChange={() => setSelection(p)}
                            />
                        </ChainItem>
                    )
                })}
            </ChainItems>
            <NextButton
                onClick={() => onNextClicked(selection)}
                disabled={selection == null}
            >
                Next
            </NextButton>
        </DialogContainer>
    )
}

export default SelectChain
