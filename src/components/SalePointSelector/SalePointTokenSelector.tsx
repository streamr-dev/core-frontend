import React, { ComponentProps, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { getDataAddress } from '~/marketplace/utils/web3'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import TextInput from '~/shared/components/Ui/Text/StyledInput'
import Button from '~/shared/components/Button'
import SelectField2 from '~/marketplace/components/SelectField2'
import { isEthereumAddress } from '~/marketplace/utils/validate'
import { SalePoint } from '~/shared/types'
import useTokenInfo, { getCachedTokenInfo, getTokenInfo } from '~/hooks/useTokenInfo'
import { TimeUnit, timeUnits } from '~/shared/utils/timeUnit'
import { errorToast } from '~/utils/toast'

const TimeUnitOptions = Object.values(timeUnits).map((unit: TimeUnit) => ({
    label: `Per ${unit}`,
    value: unit,
}))

function isTokenInfoCached(tokenAddress: string, chainId: number) {
    return typeof getCachedTokenInfo(tokenAddress, chainId) !== 'undefined'
}

export default function SalePointTokenSelector({
    disabled = false,
    salePoint,
    onSalePointChange,
}: {
    disabled?: boolean
    disabledReason?: string
    salePoint: SalePoint
    onSalePointChange?: (value: SalePoint) => void
}) {
    const { pricingTokenAddress: tokenAddress, chainId, price } = salePoint

    const dataTokenAddress = getDataAddress(chainId).toLowerCase()

    const [useDataToken, setUseDataToken] = useState(tokenAddress === dataTokenAddress)

    const [customTokenAddress, setCustomTokenAddress] = useState(
        useDataToken ? '' : tokenAddress,
    )

    useEffect(() => {
        const data = tokenAddress === dataTokenAddress

        setUseDataToken(data)

        if (!data && tokenAddress) {
            setCustomTokenAddress(tokenAddress)
        }
    }, [tokenAddress, dataTokenAddress])

    const tokenInfo = useTokenInfo(tokenAddress, chainId)

    const isLoadingTokenInfo = typeof tokenInfo === 'undefined'

    const { symbol: tokenSymbol } = tokenInfo || {}

    const isCustomTokenInfoCached = isTokenInfoCached(customTokenAddress, chainId)

    const canFetchTokenInfo =
        !disabled &&
        isEthereumAddress(customTokenAddress) &&
        !isCustomTokenInfoCached &&
        !isLoadingTokenInfo

    return (
        <Root>
            <ul>
                <li>
                    <RadioButton
                        type="button"
                        onClick={() => {
                            onSalePointChange?.({
                                ...salePoint,
                                pricingTokenAddress: dataTokenAddress,
                            })
                        }}
                    >
                        <Radio $checked={useDataToken} />
                        <span>DATA Token</span>
                        <DataTokenIcon />
                    </RadioButton>
                </li>
                <li>
                    <RadioButton
                        type="button"
                        onClick={() => {
                            onSalePointChange?.({
                                ...salePoint,
                                pricingTokenAddress: isCustomTokenInfoCached
                                    ? customTokenAddress
                                    : '',
                            })
                        }}
                    >
                        <Radio $checked={!useDataToken} />
                        <span>Custom token</span>
                    </RadioButton>
                    <CustomTokenAddressInputContainer className="custom-">
                        <label>Token contract address</label>
                        <TextInput
                            autoComplete="off"
                            disabled={disabled || isLoadingTokenInfo}
                            placeholder="e.g 0xdac17f958d2ee523a2206206994597c13d831ec7"
                            value={customTokenAddress}
                            onChange={(e: any) => {
                                const { value } = e.target

                                setCustomTokenAddress(value)

                                onSalePointChange?.({
                                    ...salePoint,
                                    pricingTokenAddress: isTokenInfoCached(value, chainId)
                                        ? value
                                        : '',
                                })
                            }}
                            invalid={
                                !!tokenAddress &&
                                getCachedTokenInfo(tokenAddress, chainId) === null
                            }
                            onFocus={() => {
                                onSalePointChange?.({
                                    ...salePoint,
                                    pricingTokenAddress: isTokenInfoCached(
                                        customTokenAddress,
                                        chainId,
                                    )
                                        ? customTokenAddress
                                        : '',
                                })
                            }}
                            onBlur={() => {
                                if (customTokenAddress) {
                                    return
                                }

                                onSalePointChange?.({
                                    ...salePoint,
                                    pricingTokenAddress: dataTokenAddress,
                                })
                            }}
                        />
                        <SetTokenContainer>
                            <Button
                                onClick={async () => {
                                    if (!canFetchTokenInfo) {
                                        return
                                    }

                                    onSalePointChange?.({
                                        ...salePoint,
                                        pricingTokenAddress: customTokenAddress,
                                    })

                                    try {
                                        /**
                                         * The only thing we check here: does `customTokenAddress` make
                                         * `getTokenInfo` explode. `useTokenInfo` won't tell.
                                         */
                                        await getTokenInfo(customTokenAddress, chainId)
                                    } catch (e) {
                                        errorToast({
                                            title: 'Invalid token contract address',
                                            desc: 'This is not an ERC-20 token contract',
                                        })
                                    }
                                }}
                                disabled={!canFetchTokenInfo}
                                waiting={isLoadingTokenInfo}
                            >
                                Set custom token
                            </Button>
                        </SetTokenContainer>
                    </CustomTokenAddressInputContainer>
                </li>
            </ul>
            <PriceContainer>
                <PriceInputWrap>
                    <TextInput
                        className="price-input"
                        placeholder="Set your price"
                        onChange={(e) => {
                            onSalePointChange?.({
                                ...salePoint,
                                price: e.target.value,
                            })
                        }}
                        value={price}
                        disabled={disabled || !tokenInfo}
                    />
                    {tokenSymbol && <TokenSymbol>{tokenSymbol}</TokenSymbol>}
                </PriceInputWrap>
                <SelectContainer>
                    <SelectField2
                        whiteVariant
                        placeholder="Unit"
                        options={TimeUnitOptions}
                        isClearable={false}
                        value={salePoint.timeUnit}
                        onChange={(timeUnit) => {
                            if (disabled || !tokenInfo) {
                                return
                            }

                            onSalePointChange?.({
                                ...salePoint,
                                timeUnit,
                            })
                        }}
                        disabled={disabled || !tokenInfo}
                    />
                </SelectContainer>
            </PriceContainer>
        </Root>
    )
}

const Root = styled.div`
    background-color: ${COLORS.inputBackground};
    border-radius: 4px;
    margin-bottom: 32px;
    padding: 24px;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    li {
        background-color: #ffffff;
        border-radius: 4px;
    }

    li + li {
        margin-top: 16px;
    }
`

const RadioButton = styled.button`
    align-items: center;
    appearance: none;
    background: transparent;
    border: 0;
    display: flex;
    font-size: 14px;
    padding: 24px 20px;
    text-align: left;
    width: 100%;

    span {
        flex-grow: 1;
        margin: 0 16px;
    }
`

function getDataTokenIconAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'DATAColor',
    }
}

const DataTokenIcon = styled(SvgIcon).attrs(getDataTokenIconAttrs)`
    display: block;
    height: 24px;
    width: 24px;
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
`

const TokenSymbol = styled.span`
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
`

const SelectContainer = styled.div`
    [class*='-control'] {
        min-height: 40px;
        border: none;
        &:hover {
            border: none;
        }
    }
`

const Radio = styled.div<{ $checked?: boolean }>`
    border-radius: 50%;
    border: 2px solid ${COLORS.radioBorder};
    height: 15px;
    position: relative;
    width: 15px;

    ::before {
        background-color: ${COLORS.link};
        border-radius: 50%;
        content: '';
        display: block;
        height: 7px;
        left: 2px;
        opacity: 0;
        position: absolute;
        top: 2px;
        transform: scale(0.5);
        transition: 120ms ease-in-out;
        transition-property: transform, opacity;
        width: 7px;
    }

    ${({ $checked = false }) =>
        $checked &&
        css`
            border-color: ${COLORS.link};

            ::before {
                opacity: 1;
                transform: scale(1);
            }
        `}
`
