import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import NetworkIcon from '$app/src/shared/components/NetworkIcon'
import { TheGraphPaymentDetails } from '$app/src/services/projects'
import { getConfigForChain } from '$app/src/shared/web3/config'
import { Radio as UnstyledRadio } from '$shared/components/Radio'
import { MEDIUM } from '$shared/utils/styled'
import useSwitchChain from '$shared/hooks/useSwitchChain'
import getChainId from '$utils/web3/getChainId'
import useIsMounted from '$shared/hooks/useIsMounted'
import { DialogContainer, DialogTitle, NextButton } from './styles'

type Props = {
    visible: boolean,
    paymentDetails: Array<TheGraphPaymentDetails>,
    onNextClicked: (paymentDetails: TheGraphPaymentDetails) => void,
    onCancelClicked: () => void,
}

type ChainOption = TheGraphPaymentDetails & {
    chainId: number,
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

const ButtonContainer = styled.div`
    display: inline-grid;
    grid-template-columns: 1fr auto;
`

const SelectChain = ({ visible, paymentDetails, onNextClicked, onCancelClicked }: Props) => {
    const [selection, setSelection] = useState<TheGraphPaymentDetails | null>(null)
    const { switchChain } = useSwitchChain()
    const isMounted = useIsMounted()

    const chainOptions = useMemo(() => {
        const values = Object.values(paymentDetails).map((p) => {
            const chainId = Number.parseInt(p.domainId)
            if (!Number.isSafeInteger(chainId)) {
                console.error("Skipping chain because domainId is not a number", p.domainId)
            }
            return {
                ...p,
                chainId,
            }
        })
        return values as ChainOption[]
    }, [paymentDetails])

    useEffect(() => {
        const loadChainId = async () => {
            const chainId = await getChainId()
            if (isMounted() && paymentDetails) {
                const chainPd = paymentDetails.find((p) => p.domainId === chainId.toString())
                if (chainPd) {
                    // Set current chain as preselected value
                    setSelection(chainPd)
                }
            }
        }

        loadChainId()
    }, [paymentDetails, isMounted])

    const onNext = useCallback(async () => {
        await switchChain(Number.parseInt(selection.domainId))
        onNextClicked(selection)
    }, [onNextClicked, selection, switchChain])

    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <DialogTitle>Select chain for payment token</DialogTitle>
            <ChainItems>
                {chainOptions.map((p) => (
                    <ChainItem key={p.chainId} htmlFor={`paymentChain-${p.chainId}`}>
                        <ChainIcon chainId={p.chainId} />
                        <Name>{getConfigForChain(p.chainId).name}</Name>
                        <Radio
                            id={`paymentChain-${p.chainId}`}
                            name="paymentChain"
                            value={p.chainId}
                            label=""
                            checked={selection != null && selection.domainId === p.chainId.toString()}
                            onChange={() => setSelection(p)}
                        />
                    </ChainItem>
                ))}
            </ChainItems>
            <ButtonContainer>
                <NextButton
                    kind='link'
                    onClick={onCancelClicked}
                >
                    Cancel
                </NextButton>
                <NextButton
                    onClick={onNext}
                    disabled={selection == null}
                >
                    Next
                </NextButton>
            </ButtonContainer>
        </DialogContainer>
    )
}

export default SelectChain
