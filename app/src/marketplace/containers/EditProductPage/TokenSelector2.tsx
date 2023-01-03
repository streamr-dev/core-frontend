import React, { useState, useEffect, useContext, useMemo, FunctionComponent, useRef, useCallback } from 'react'
import styled from 'styled-components'
import BN from 'bignumber.js'
import SvgIcon from '$shared/components/SvgIcon'
import { getDataAddress, getTokenInformation } from '$mp/utils/web3'
import { getChainIdFromApiString } from '$shared/utils/chains'
import useIsMounted from '$shared/hooks/useIsMounted'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import { COLORS, MEDIUM, REGULAR } from '$shared/utils/styled'
import { Radio } from '$shared/components/Radio'
import Text from '$ui/Text'
import Button from '$shared/components/Button'
import SelectField2 from '$mp/components/SelectField2'
import { timeUnits } from '$shared/utils/constants'
import { TimeUnit } from '$shared/types/common-types'
type Props = {
    disabled?: boolean
}
const Container = styled.div`
  color: ${COLORS.primary};
  max-width: 678px;
`

const Heading = styled.p`
  color: black;
  font-weight: ${REGULAR};
  font-size: 34px;
  margin-bottom: 44px;
`

const SubHeading = styled.p`
  font-size: 20px;
  margin-bottom: 16px;
`

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
`

const Form = styled.div`
  border-radius: 4px;
  background-color: ${COLORS.docLink};
  padding: 24px;
`

const RadioContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  
  .radio {
    padding: 24px 20px;
    width: 100%;
  }
  
  &.data-token-radio-container {
    margin-bottom: 16px
  }
`

const RadioLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .data-icon {
    width: 24px;
    height: 24px;
  }
`

const CustomTokenAddressInputContainer = styled.div`
  padding: 0 20px 24px;
  label {
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 9px;
  }
`

const SetTokenContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`

const PriceContainer = styled.div`
  display: flex;
  margin-top: 16px;
`

const PriceInputWrap = styled.div`
  position: relative;
  flex: 1;
  margin-right: 16px;
  .price-input {
    padding-right: 60px;
    &:disabled {
      background-color: white;
      opacity: 1;
    }
  }
  .token-symbol {
    position: absolute;
    right: 12px;
    top: 5px;
    font-size: 14px;
    border-left: 1px solid ${COLORS.separator};
    padding-left: 12px;
    color: ${COLORS.primaryLight}
  }
`

const SelectContainer = styled.div`
    [class*="-control"] {
      min-height: 40px;
      border: none;
      &:hover {
        border:none;
      }
    }
`

enum TokenType {
    DATA = 'data',
    Custom = 'custom',
}

const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => ({
    label: `Per ${unit}`,
    value: unit,
}))

const TokenSelector2: FunctionComponent<Props> = ({ disabled }) => {
    const isMounted = useIsMounted()
    const { state: project } = useContext(ProjectStateContext)
    const { updatePricingToken, updatePrice } = useEditableProjectActions()
    const [selection, setSelection] = useState<TokenType>(null)
    const [customTokenAddress, setCustomTokenAddress] = useState<string>('')
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>(null)
    const [tokenSymbol, setTokenSymbol] = useState(null)
    const [error, setError] = useState(null)
    const [tokenDecimals, setTokenDecimals] = useState(18)
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const chainId = useMemo(() => {
        return project.chain ? getChainIdFromApiString(project.chain) : undefined
    }, [project.chain])
    const { pricingTokenAddress } = project

    // Set default value to DATA
    /*useEffect(() => {
        if (!pricingTokenAddress) {
            setSelection(TokenType.DATA)
        }
    }, [pricingTokenAddress])*/

    useEffect(() => {
        if (chainId && pricingTokenAddress) {
            let loading = true

            const check = async () => {
                const dataAddress = getDataAddress(chainId)

                if (pricingTokenAddress === dataAddress) {
                    setSelection(TokenType.DATA)
                } else if (pricingTokenAddress != null) {
                    setSelection(TokenType.Custom)
                    setCustomTokenAddress(pricingTokenAddress)
                }

                const info = await getTokenInformation(pricingTokenAddress, chainId)
                if (!isMounted()) {
                    return
                }

                if (!loading) {
                    return
                }

                if (info) {
                    setError(null)
                    setTokenSymbol(info.symbol)
                    setTokenDecimals(info.decimals)
                } else {
                    // TODO: trigger a toast notification with error
                    setError('This is not an ERC-20 token contract')
                    setTokenSymbol(null)
                    setTokenDecimals(null)
                    updatePricingToken('', new BN(tokenDecimals || 18))
                }
            }

            check()

            // Allow only latest load operation
            return () => {
                loading = false
            }
        }
    }, [pricingTokenAddress, chainId, isMounted])

    useEffect(() => {
        if (chainId && !selection) {
            setSelection(TokenType.DATA)
        }

        if (!chainId || !selection) {
            return
        }
        if (selection === TokenType.DATA) {
            setCustomTokenAddress('')
            setSelectedTokenAddress(getDataAddress(chainId))
            setIsEditable(false)
            setTokenSymbol(null)
        } else if (selection === TokenType.Custom) {
            setSelectedTokenAddress(null)
            setIsEditable(customTokenAddress.length === 0)
            setTokenSymbol(null)
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection, chainId])

    // Update product pricingToken
    useEffect(() => {
        if (selectedTokenAddress) {
            updatePricingToken(selectedTokenAddress, new BN(tokenDecimals || 18))
        }
    }, [selectedTokenAddress, tokenDecimals])

    const handlePriceUpdate = useCallback((price: string) => {
        updatePrice(price, project.priceCurrency, project.timeUnit, new BN(project.pricingTokenDecimals))
    }, [project])

    const handleTimeUnitUpdate = useCallback((timeUnit: string) => {
        updatePrice(project.price, project.priceCurrency, timeUnit, new BN(project.pricingTokenDecimals))
    }, [project])

    return (
        <Container>
            <Heading>Select token</Heading>
            <Description>
                You can set a price for others to access the streams in your project.
                The price can be set in DATA or any other ERC-20 token.
            </Description>
            <SubHeading>
                Set the payment token and price
            </SubHeading>
            <Form>
                <RadioContainer className={'data-token-radio-container'}>
                    <Radio
                        id={'data-token'}
                        name={'token-selector'}
                        label={<RadioLabel>
                            <span>DATA Token</span>
                            <SvgIcon name={'DATAColor'} className={'data-icon'} />
                        </RadioLabel>}
                        value={TokenType.DATA}
                        disabled={!chainId}
                        disabledReason={'You need to select the chain first!'}
                        onChange={setSelection}
                        className={'radio'}
                        checked={selection === TokenType.DATA}
                    />
                </RadioContainer>
                <RadioContainer>
                    <Radio
                        id={'custom-token'}
                        name={'token-selector'}
                        label={<RadioLabel>
                            <span>Custom Token</span>
                        </RadioLabel>}
                        value={TokenType.Custom}
                        disabled={!chainId}
                        disabledReason={'You need to select the chain first!'}
                        onChange={setSelection}
                        className={'radio'}
                        checked={selection === TokenType.Custom}
                    />
                    <CustomTokenAddressInputContainer className={'custom-'}>
                        <label>Token contract address</label>
                        <Text
                            autoComplete="off"
                            disabled={selection !== TokenType.Custom || disabled || !isEditable}
                            placeholder={'e.g 0xdac17f958d2ee523a2206206994597c13d831ec7'}
                            value={customTokenAddress}
                            onChange={(e) => setCustomTokenAddress(e.target.value)}
                            selectAllOnFocus
                            smartCommit
                        />
                        <SetTokenContainer>
                            <Button
                                onClick={() => {
                                    setSelectedTokenAddress(customTokenAddress)
                                }}
                            >Set Custom Token</Button>
                        </SetTokenContainer>
                    </CustomTokenAddressInputContainer>
                </RadioContainer>
                <PriceContainer>
                    <PriceInputWrap>
                        <Text
                            className={'price-input'}
                            placeholder={'Set your price'}
                            onChange={(event) => {handlePriceUpdate(event.target.value)}}
                            disabled={!chainId}
                        />
                        {tokenSymbol && <span className={'token-symbol'}>{tokenSymbol}</span>}
                    </PriceInputWrap>
                    <SelectContainer>
                        <SelectField2
                            whiteVariant={true}
                            placeholder={'Unit'}
                            options={options}
                            isClearable={false}
                            onChange={(selected) => {handleTimeUnitUpdate(selected)}}
                            disabled={!chainId}
                        />
                    </SelectContainer>
                </PriceContainer>
            </Form>
        </Container>
    )
}

export default TokenSelector2
