// @flow

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Text from '$ui/Text'
import Label from '$ui/Label'
import SvgIcon from '$shared/components/SvgIcon'
import UnstyledButton from '$shared/components/Button'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { getDataAddress, getTokenInformation } from '$mp/utils/web3'
import { getChainIdFromApiString } from '$shared/utils/chains'
import UnstyledTokenLogo from '$shared/components/TokenLogo'
import useIsMounted from '$shared/hooks/useIsMounted'

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
    align-self: center;
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

const Button = styled(UnstyledButton)`
    width: fit-content;
    justify-self: right;
`

const TokenLogo = styled(UnstyledTokenLogo)`
    margin-right: 8px;
`

const MatchedTokenField = styled.div`
    background: #F8F8F8;
    border-radius: 4px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 16px;
    font-size: 16px;
    line-height: 16px;
`

const TokenType = {
    DATA: 'data',
    Custom: 'custom',
}

const TokenSelector = ({ disabled }: Props) => {
    const isMounted = useIsMounted()
    const { state: product } = useEditableState()
    const { updatePricingToken } = useEditableProductActions()
    const [selection, setSelection] = useState(null)
    const [customTokenAddress, setCustomTokenAddress] = useState('')
    const [selectedTokenAddress, setSelectedTokenAddress] = useState(null)
    const [tokenSymbol, setTokenSymbol] = useState(null)
    const [isEditable, setIsEditable] = useState(false)
    const chainId = getChainIdFromApiString(product.chain)

    useEffect(() => {
        const check = async () => {
            const dataAddress = getDataAddress(chainId)
            if (product.pricingTokenAddress === dataAddress) {
                setSelection(TokenType.DATA)
            } else if (product.pricingTokenAddress != null) {
                setSelection(TokenType.Custom)
                setCustomTokenAddress(product.pricingTokenAddress)

                const info = await getTokenInformation(product.pricingTokenAddress, chainId)
                if (!isMounted()) {
                    return
                }

                if (info) {
                    setTokenSymbol(info.symbol)
                } else {
                    setTokenSymbol(null)
                }
            }
        }
        check()
    }, [product.pricingTokenAddress, chainId, isMounted])

    useEffect(() => {
        if (selection === TokenType.DATA) {
            setCustomTokenAddress('')
            setSelectedTokenAddress(getDataAddress(chainId))
            setIsEditable(false)
            setTokenSymbol(null)
        } else if (selection === TokenType.Custom) {
            setSelectedTokenAddress(null)
            setIsEditable(customTokenAddress.length === 0)
            setTokenSymbol(null)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection, chainId])

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
                        onChange={() => {
                            setSelection(TokenType.DATA)
                        }}
                        disabled={disabled}
                    />
                    DATA token
                    <Icon name="DATAColor" />
                </RadioContainer>
            </Item>
            <Item>
                <RadioContainer htmlFor="custom">
                    <Radio
                        id="custom"
                        type="radio"
                        name="token"
                        checked={selection === TokenType.Custom}
                        onChange={() => {
                            setSelection(TokenType.Custom)
                        }}
                        disabled={disabled}
                    />
                    Custom token
                </RadioContainer>
                <CustomTokenContainer>
                    <SmallLabel htmlFor="tokenContractAddress">
                        Token contract address
                        {tokenSymbol == null ? (
                            <Text
                                id="tokenContractAddress"
                                autoComplete="off"
                                disabled={selection !== TokenType.Custom || disabled || !isEditable}
                                placeholder="e.g 0xdac17f958d2ee523a2206206994597c13d831ec7"
                                value={customTokenAddress}
                                onChange={(e) => setCustomTokenAddress(e.target.value)}
                                selectAllOnFocus
                                smartCommit
                            />
                        ) : (
                            <MatchedTokenField>
                                <TokenLogo
                                    contractAddress={selectedTokenAddress}
                                    chainId={chainId}
                                />
                                {' '}
                                <span>{tokenSymbol}</span>
                            </MatchedTokenField>
                        )}
                    </SmallLabel>
                    {isEditable ? (
                        <Button
                            disabled={selection !== TokenType.Custom || disabled || (customTokenAddress != null && customTokenAddress.length === 0)}
                            onClick={() => {
                                setSelectedTokenAddress(customTokenAddress)
                                setIsEditable(false)
                            }}
                        >
                            Add custom token
                        </Button>
                    ) : (
                        <Button
                            disabled={selection !== TokenType.Custom || disabled || (customTokenAddress != null && customTokenAddress.length === 0)}
                            onClick={() => {
                                setIsEditable(true)
                                setCustomTokenAddress('')
                                setTokenSymbol(null)
                            }}
                        >
                            Change custom token
                        </Button>
                    )}
                </CustomTokenContainer>
            </Item>
        </Container>
    )
}

export default TokenSelector
