import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import { Chain } from '@streamr/config'
import styled from 'styled-components'
import BN from 'bignumber.js'
import SvgIcon from '$shared/components/SvgIcon'
import { getDataAddress, getTokenInformation } from '$mp/utils/web3'
import useIsMounted from '$shared/hooks/useIsMounted'
import { COLORS, MAX_CONTENT_WIDTH, MEDIUM, REGULAR } from '$shared/utils/styled'
import { Radio } from '$shared/components/Radio'
import Text from '$ui/Text'
import Button from '$shared/components/Button'
import SelectField2 from '$mp/components/SelectField2'
import { contractCurrencies, NotificationIcon, timeUnits } from '$shared/utils/constants'
import { ContractCurrency, TimeUnit } from '$shared/types/common-types'
import useValidation from '$mp/containers/ProductController/useValidation'
import { SeverityLevel } from '$mp/containers/ProductController/ValidationContextProvider'
import Notification from '$shared/utils/Notification'
import { Address } from '$shared/types/web3-types'
import { PricingData, Project } from '$mp/types/project-types'
import { RecursiveKeyOf } from '$utils/recursiveKeyOf'
import { pricePerSecondFromTimeUnit } from '$mp/utils/price'

const Container = styled.div`
  color: ${COLORS.primary};
  max-width: ${MAX_CONTENT_WIDTH};
`

const Heading = styled.p`
  color: black;
  font-weight: ${REGULAR};
  font-size: 20px;
  margin-bottom: 22px;
`

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
`

const Form = styled.div`
  border-radius: 4px;
  background-color: ${COLORS.inputBackground};
  padding: 24px;
  margin-bottom: 32px;
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
    top: 0;
    height: 100%;
    font-size: 14px;
    border-left: 1px solid ${COLORS.separator};
    padding-left: 12px;
    color: ${COLORS.primaryLight};
    display: flex;
    align-items: center;
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

const options = Object.values(timeUnits).map((unit: TimeUnit) => ({
    label: `Per ${unit}`,
    value: unit,
}))

type Props = {
    disabled?: boolean,
    chain: Chain,
    onChange: (pricing: PricingData) => void,
    value?: PricingData,
    validationFieldName: RecursiveKeyOf<Project>,
    tokenChangeDisabled: boolean
}

const TokenSelector: FunctionComponent<Props> = ({
    disabled,
    onChange,
    chain,
    validationFieldName,
    value,
    tokenChangeDisabled
}) => {
    const dataAddress = useMemo(() => getDataAddress(chain.id).toLowerCase(), [chain])
    const isMounted = useIsMounted()
    const [selection, setSelection] = useState<ContractCurrency>(
        (value?.tokenAddress && value?.tokenAddress === dataAddress)
            ? contractCurrencies.DATA
            : contractCurrencies.PRODUCT_DEFINED
    )
    const [customTokenAddress, setCustomTokenAddress] = useState<Address>(
        (value?.tokenAddress && value?.tokenAddress !== dataAddress)
            ? value.tokenAddress
            : ''
    )
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<Address>(value?.tokenAddress?.toLowerCase())
    const [tokenSymbol, setTokenSymbol] = useState<string>(null)
    const [price, setPrice] = useState<string>(value?.price?.toString())
    const [timeUnit, setTimeUnit] = useState<TimeUnit>(value?.timeUnit)
    const [tokenDecimals, setTokenDecimals] = useState<number>(18)
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const {setStatus, clearStatus, isValid} = useValidation(validationFieldName)
    const pricingTokenAddress = value?.tokenAddress?.toLowerCase()

    const debouncedOnChange = useMemo(() => debounce(onChange, 50), [onChange])

    useEffect(() => {
        clearStatus()
    }, [chain])

    // Set default value to DATA
    useEffect(() => {
        if (!pricingTokenAddress) {
            setSelection('DATA')
        }
    }, [])

    useEffect(() => {
        if (pricingTokenAddress && chain.id) {
            let loading = true

            const check = async () => {

                if (pricingTokenAddress === dataAddress) {
                    setSelection(contractCurrencies.DATA)
                } else if (pricingTokenAddress != null) {
                    setSelection(contractCurrencies.PRODUCT_DEFINED)
                    setCustomTokenAddress(pricingTokenAddress)
                }

                const info = await getTokenInformation(pricingTokenAddress, chain.id)
                if (!isMounted()) {
                    return
                }

                if (!loading) {
                    return
                }

                if (info) {
                    clearStatus()
                    setTokenSymbol(info.symbol)
                    setTokenDecimals(info.decimals)
                } else {
                    Notification.push({
                        title: 'Invalid token contract address',
                        description: 'This is not an ERC-20 token contract',
                        icon: NotificationIcon.ERROR
                    })
                    setStatus(SeverityLevel.ERROR, 'This is not an ERC-20 token contract')
                    setTokenSymbol(null)
                    setTokenDecimals(null)
                }
            }

            check()

            // Allow only latest load operation
            return () => {
                loading = false
            }
        }
    }, [pricingTokenAddress, isMounted, clearStatus, setStatus])

    useEffect(() => {

        if (!selection || !chain.id) {
            return
        }
        if (selection === contractCurrencies.DATA) {
            setCustomTokenAddress('')
            setSelectedTokenAddress(getDataAddress(chain.id))
            setIsEditable(false)
            setTokenSymbol(null)
        } else if (selection === contractCurrencies.PRODUCT_DEFINED) {
            setSelectedTokenAddress(null)
            setIsEditable(customTokenAddress.length === 0)
            setTokenSymbol(null)
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection, chain.id])

    useEffect(() => {
        const output: PricingData = {
            price: price ? new BN(price) : undefined,
            timeUnit,
            tokenAddress: selectedTokenAddress?.toLowerCase(),
            pricePerSecond: (price && timeUnit && tokenDecimals)
                ? new BN(pricePerSecondFromTimeUnit(new BN(price), timeUnit, new BN(tokenDecimals)))
                : undefined
        }
        debouncedOnChange(output)
    }, [price, timeUnit, selectedTokenAddress, selection, tokenDecimals])

    return (
        <Container>
            <Heading>Set the payment token a and price on {chain?.name || 'the selected'} chain</Heading>
            <Description>
                You can set a price for others to access the streams in your project.
                The price can be set in DATA or any other ERC-20 token.
            </Description>
            <Form>
                <RadioContainer className={'data-token-radio-container'}>
                    <Radio
                        id={'data-token'}
                        name={'token-selector-' + chain.name}
                        label={<RadioLabel>
                            <span>DATA Token</span>
                            <SvgIcon name={'DATAColor'} className={'data-icon'} />
                        </RadioLabel>}
                        value={contractCurrencies.DATA}
                        disabled={disabled || tokenChangeDisabled}
                        disabledReason={'You need to select the chain first!'}
                        onChange={setSelection}
                        className={'radio'}
                        checked={selection === contractCurrencies.DATA}
                    />
                </RadioContainer>
                <RadioContainer>
                    <Radio
                        id={'custom-token'}
                        name={'token-selector-' + chain.name}
                        label={<RadioLabel>
                            <span>Custom Token</span>
                        </RadioLabel>}
                        value={contractCurrencies.PRODUCT_DEFINED}
                        disabled={disabled || tokenChangeDisabled}
                        disabledReason={'You need to select the chain first!'}
                        onChange={setSelection}
                        className={'radio'}
                        checked={selection === contractCurrencies.PRODUCT_DEFINED}
                    />
                    <CustomTokenAddressInputContainer className={'custom-'}>
                        <label>Token contract address</label>
                        <Text
                            autoComplete="off"
                            disabled={selection !== contractCurrencies.PRODUCT_DEFINED || disabled || !isEditable || tokenChangeDisabled}
                            placeholder={'e.g 0xdac17f958d2ee523a2206206994597c13d831ec7'}
                            value={customTokenAddress}
                            onChange={(e) => setCustomTokenAddress(e.target.value)}
                            selectAllOnFocus
                            smartCommit
                            invalid={!isValid}
                        />
                        <SetTokenContainer>
                            <Button
                                onClick={() => {
                                    setSelectedTokenAddress(customTokenAddress)
                                }}
                                disabled={disabled}
                            >Set Custom Token</Button>
                        </SetTokenContainer>
                    </CustomTokenAddressInputContainer>
                </RadioContainer>
                <PriceContainer>
                    <PriceInputWrap>
                        <Text
                            className={'price-input'}
                            placeholder={'Set your price'}
                            onChange={(event) => {setPrice(event.target.value)}}
                            defaultValue={value?.price ? value.price.toString() : undefined}
                            disabled={disabled}
                        />
                        {tokenSymbol && <span className={'token-symbol'}>{tokenSymbol}</span>}
                    </PriceInputWrap>
                    <SelectContainer>
                        <SelectField2
                            whiteVariant={true}
                            placeholder={'Unit'}
                            options={options}
                            isClearable={false}
                            value={timeUnit}
                            onChange={(selected) => {setTimeUnit(selected as TimeUnit)}}
                            disabled={disabled}
                        />
                    </SelectContainer>
                </PriceContainer>
            </Form>
        </Container>
    )
}

export default TokenSelector
