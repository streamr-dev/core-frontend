import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Chain } from '@streamr/config'
import { COLORS } from '$shared/utils/styled'
import Checkbox from '$shared/components/Checkbox'
import SvgIcon from '$shared/components/SvgIcon'
import NetworkIcon from '$shared/components/NetworkIcon'
import { PricingData, SalePoint } from '$mp/types/project-types'
import TokenSelector2 from '$mp/containers/EditProductPage/TokenSelector2'
import { BeneficiaryAddress2 } from '$mp/containers/EditProductPage/BeneficiaryAddress2'
import { Address } from '$shared/types/web3-types'

export const PricingOption: FunctionComponent<{
    onToggle?: (salePoint: SalePoint) => void,
    chain: Chain,
    pricingData?: PricingData
    onChange: (pricingData: SalePoint | null) => void
}> = ({onToggle, chain, pricingData, onChange}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const [isSelected, setIsSelected] = useState<boolean>(!!pricingData)
    const toggleDropdown = useCallback(() => setIsDropdownOpen(!isDropdownOpen), [isDropdownOpen])
    const [pricing, setPricing] = useState<PricingData>({} as PricingData)
    const [beneficiaryAddress, setBeneficiaryAddress] = useState<Address>()

    const handleToggleClick = useCallback(() => {
        toggleDropdown()
        // this might seem a bit silly, but it's needed for the use case when we are toggling the first Option
        // while having none selected, then it will be marked as selected
        if (onToggle) {
            onToggle({
                chainId: chain.id,
                pricePerSecond: pricing?.pricePerSecond?.toString(),
                timeUnit: pricing.timeUnit,
                price: pricing?.price?.toString(),
                pricingTokenAddress: pricing.tokenAddress,
                beneficiaryAddress: beneficiaryAddress
            })
        }
    }, [onToggle, toggleDropdown, pricing, beneficiaryAddress])

    useEffect(() => {
        const output = isSelected ? {
            chainId: chain.id,
            pricePerSecond: pricing?.pricePerSecond?.toString(),
            timeUnit: pricing.timeUnit,
            price: pricing?.price?.toString(),
            pricingTokenAddress: pricing.tokenAddress,
            beneficiaryAddress: beneficiaryAddress
        } : null
        onChange(output)
    }, [isSelected, pricing, beneficiaryAddress])

    useEffect(() => {
        if (!!pricingData) {
            setIsSelected(true)
        }
    }, [pricingData])

    return <DropdownWrap className={isDropdownOpen ? 'is-open' : ''}>
        <DropdownToggle onClick={handleToggleClick} className={isDropdownOpen ? 'is-open' : ''}>
            <label>
                <StyledCheckbox
                    value={isSelected}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                        setIsSelected(event.target.checked)
                    }}/>
            </label>
            <ChainIcon chainId={chain.id} />
            <span>{chain.name}</span>
            <PlusSymbol name={'plus'} className={isDropdownOpen ? 'is-open' : ''}/>
        </DropdownToggle>
        <DropdownOuter className={isDropdownOpen ? 'is-open' : ''}>
            <DropdownInner className={isDropdownOpen ? 'is-open' : ''}>
                <TokenSelector2
                    disabled={!isSelected}
                    chain={chain}
                    onChange={setPricing}
                    validationFieldName={'salePoints'}
                    value={pricingData ? {
                        tokenAddress: pricingData.tokenAddress,
                        price: pricingData.price,
                        timeUnit: pricingData.timeUnit,
                        pricePerSecond: pricingData.pricePerSecond
                    } : null}
                />
                <BeneficiaryAddress2
                    beneficiaryAddress={pricingData?.beneficiaryAddress}
                    onChange={setBeneficiaryAddress}
                    chainName={chain.name}
                />
            </DropdownInner>
        </DropdownOuter>
    </DropdownWrap>
}

const DropdownWrap = styled.div`
  overflow: hidden;
  box-shadow: 0 1px 2px 0 #00000026, 0 0 1px 0 #00000040;
  border-radius: 4px;
  margin-bottom: 24px;
  color: ${COLORS.primary};

  &:last-of-type {
    margin-bottom: 0;
  }
`
const DropdownOuter = styled.div`
  overflow: hidden;
`
const DropdownInner = styled.div`
  padding: 24px 24px 75px;
  transition: margin-bottom 0.5s ease-in-out;
  margin-bottom: -200%;
  
  &.is-open {
    margin-bottom: 0;
  }
`
const DropdownToggle = styled.div`
  padding: 24px 24px 24px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &:hover {
    background-color: ${COLORS.secondary};
  }
  &.is-open:hover {
    background-color: inherit;
  }
  
  label {
    display: flex;
    padding: 12px;
    align-items: center;
    justify-content: center;
    margin: 0;
    cursor: pointer;
  }
`

const StyledCheckbox = styled(Checkbox)`
  cursor: pointer;
`

const PlusSymbol = styled(SvgIcon)`
  width: 14px; 
  margin-left: auto;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  &.is-open {
    transform: rotate(45deg);
  }
`

const ChainIcon = styled(NetworkIcon)`
  width: 32px;
  height: 32px;
  margin-right: 12px;
`
