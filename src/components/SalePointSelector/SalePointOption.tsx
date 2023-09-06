import React, { ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { SalePoint } from '~/shared/types'
import { COLORS } from '~/shared/utils/styled'
import { Tick as PrestyledTick } from '~/shared/components/Checkbox'
import NetworkIcon from '~/shared/components/NetworkIcon'
import { getConfigForChain } from '~/shared/web3/config'
import { formatChainName } from '~/shared/utils/chains'
import SalePointTokenSelector from './SalePointTokenSelector'
import BeneficiaryAddressEditor from './BeneficiaryAddressEditor'

export default function SalePointOption({
    onSalePointChange,
    salePoint,
}: {
    onSalePointChange?: (value: SalePoint) => void
    onToggle?: (chainId: number, selected: boolean) => void
    salePoint: SalePoint
}) {
    const { chainId, enabled, readOnly } = salePoint

    const chain = getConfigForChain(chainId)

    const formattedChainName = formatChainName(chain.name)

    return (
        <DropdownWrap $open={enabled}>
            <DropdownToggle
                onClick={() => {
                    onSalePointChange?.({
                        ...salePoint,
                        enabled: !salePoint.enabled,
                    })
                }}
            >
                <Tick $checked={enabled} $disabled={readOnly} />
                <ChainIcon chainId={chainId} />
                <span>{formattedChainName}</span>
                <PlusSymbol />
            </DropdownToggle>
            <DropdownOuter>
                <DropdownInner>
                    <h4>
                        Set the payment token and price on the {formattedChainName} chain
                    </h4>
                    <p>
                        You can set a price for others to access the streams in your
                        project. The price can be set in DATA or any other ERC-20 token.
                    </p>
                    <SalePointTokenSelector
                        disabled={readOnly}
                        onSalePointChange={onSalePointChange}
                        salePoint={salePoint}
                    />
                    <h4>Set beneficiary</h4>
                    <p>
                        This wallet address receives the payments for this product on{' '}
                        {formattedChainName} chain.
                    </p>
                    <BeneficiaryAddressEditor
                        chainName={chain.name}
                        disabled={readOnly}
                        value={salePoint.beneficiaryAddress}
                        onChange={(beneficiaryAddress) => {
                            onSalePointChange?.({
                                ...salePoint,
                                beneficiaryAddress,
                            })
                        }}
                    />
                </DropdownInner>
            </DropdownOuter>
        </DropdownWrap>
    )
}

const DropdownToggle = styled.div`
    padding: 24px 24px 24px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    :hover {
        background-color: ${COLORS.secondary};
    }
`

const DropdownInner = styled.div`
    padding: 24px 24px 75px;
    transition: margin-bottom 0.5s ease-in-out;
    margin-bottom: -200%;
`

function getPlusSymbolAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'plus',
    }
}

const PlusSymbol = styled(SvgIcon).attrs(getPlusSymbolAttrs)`
    margin-left: auto;
    transition: transform 0.3s ease-in-out;
    width: 14px;
`

const DropdownWrap = styled.div<{ $open?: boolean }>`
    overflow: hidden;
    box-shadow: 0 1px 2px 0 #00000026, 0 0 1px 0 #00000040;
    border-radius: 4px;
    color: ${COLORS.primary};

    & + & {
        margin-top: 24px;
    }

    ${({ $open = false }) =>
        $open &&
        css`
            ${DropdownInner} {
                margin-bottom: 0;
            }

            ${DropdownToggle}:hover {
                background-color: inherit;
            }

            ${PlusSymbol} {
                transform: rotate(45deg);
            }
        `}
`

const DropdownOuter = styled.div`
    overflow: hidden;
`

const Tick = styled(PrestyledTick)<{ $disabled?: boolean }>`
    cursor: pointer;
    margin: 0 20px 0 12px;

    ${({ $disabled = false }) =>
        $disabled &&
        css`
            opacity: 0.3;
        `}
`

const ChainIcon = styled(NetworkIcon)`
    width: 32px;
    height: 32px;
    margin-right: 12px;
`
