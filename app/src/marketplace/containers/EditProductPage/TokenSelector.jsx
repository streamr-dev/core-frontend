// @flow

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Text from '$ui/Text'
import Label from '$ui/Label'
import SvgIcon from '$shared/components/SvgIcon'
import Button from '$shared/components/Button'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import getChainId from '$utils/web3/getChainId'
import { getDataAddress } from '$mp/utils/web3'

import useEditableProductActions from '../ProductController/useEditableProductActions'

type Props = {
    disabled?: boolean,
}

const Container = styled.div`
    background: #F1F1F1;
    border-radius: 4px;
    display: grid;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1.5em;
`

const Item = styled.div`
    background: #FFFFFF;
    border-radius: 4px;
    line-height: 64px;
`

const Icon = styled(SvgIcon)`
    align-self: center;
`

const Radio = styled.input`
    width: 16px;
    justify-self: center;
`

const RadioContainer = styled.label`
    width: 100%;
    margin: 0;
    display: grid;
    grid-template-columns: 48px auto 48px;
`

const SmallLabel = styled(Label)`
    display: block;
    font-size: 12px;
    font-weight: 500;
    line-height: 1em;
    margin: 0 0 8px;
`

const CustomTokenContainer = styled.div`
    display: grid;
    grid-template-rows: auto auto;
    margin: 0 24px 24px 48px;
`

const AddButton = styled(Button)`
    width: fit-content;
    justify-self: right;
`

const TokenType = {
    DATA: 'data',
    Custom: 'custom',
}

const TokenSelector = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { updatePricingToken } = useEditableProductActions()
    const [selection, setSelection] = useState(null)
    const [customTokenAddress, setCustomTokenAddress] = useState('')
    const [selectedTokenAddress, setSelectedTokenAddress] = useState(null)

    useEffect(() => {
        const check = async () => {
            const chainId = await getChainId()
            const dataAddress = getDataAddress(chainId)
            if (product.pricingTokenAddress === dataAddress) {
                setSelection(TokenType.DATA)
                setCustomTokenAddress('')
            } else if (product.pricingTokenAddress != null) {
                setSelection(TokenType.Custom)
                setCustomTokenAddress(product.pricingTokenAddress)
            }
        }
        check()
    }, [product.pricingTokenAddress])

    useEffect(() => {
        if (selectedTokenAddress) {
            updatePricingToken(selectedTokenAddress)
        }
    }, [selectedTokenAddress, updatePricingToken])

    return (
        <Container>
            <Item>
                <RadioContainer htmlFor="data">
                    <Radio
                        id="data"
                        type="radio"
                        name="token"
                        checked={selection === TokenType.DATA}
                        onChange={async () => {
                            setSelection(TokenType.DATA)
                            const chainId = await getChainId()
                            const address = getDataAddress(chainId)
                            setSelectedTokenAddress(address)
                        }}
                        disabled={disabled}
                    />
                    DATA token
                    <Icon name="DATA" />
                </RadioContainer>
            </Item>
            <Item>
                <RadioContainer htmlFor="custom">
                    <Radio
                        id="custom"
                        type="radio"
                        name="token"
                        checked={selection === TokenType.Custom}
                        onChange={() => setSelection(TokenType.Custom)}
                        disabled={disabled}
                    />
                    Custom token
                </RadioContainer>
                <CustomTokenContainer>
                    <SmallLabel htmlFor="tokenContractAddress">
                        Add token contract address
                        <Text
                            id="tokenContractAddress"
                            autoComplete="off"
                            disabled={selection !== TokenType.Custom || disabled}
                            placeholder="e.g 0xdac17f958d2ee523a2206206994597c13d831ec7"
                            value={customTokenAddress}
                            onChange={(e) => setCustomTokenAddress(e.target.value)}
                            selectAllOnFocus
                            smartCommit
                        />
                    </SmallLabel>
                    <AddButton
                        disabled={selection !== TokenType.Custom || disabled}
                        onClick={() => setSelectedTokenAddress(customTokenAddress)}
                    >
                        {customTokenAddress ? 'Change' : 'Add'} custom token
                    </AddButton>
                </CustomTokenContainer>
            </Item>
        </Container>
    )
}

export default TokenSelector
