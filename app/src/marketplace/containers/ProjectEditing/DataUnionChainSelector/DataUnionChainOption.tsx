import React, { FunctionComponent, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Chain } from '@streamr/config'
import { COLORS } from '$shared/utils/styled'
import NetworkIcon from '$shared/components/NetworkIcon'
import { Radio } from '$shared/components/Radio'
import {
    DataUnionChainSelectorContext
} from '$mp/containers/ProjectEditing/DataUnionChainSelector/DataUnionChainSelectorContext'
import { Address } from '$shared/types/web3-types'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getDataUnionObject, getDataUnionsOwnedByInChain, TheGraphDataUnion } from '$mp/modules/dataUnion/services'
import SelectField2 from '$mp/components/SelectField2'
import { useWalletAccount } from '$app/src/shared/stores/wallet'
import {truncate} from "$shared/utils/text"
import {formatChainName} from "$shared/utils/chains"

type DataUnionChainOptionProps = {
    index: number,
    chain: Chain,
    disabled?: boolean,
    onChange: (chainSelection: {deployNewDU: boolean, existingDUAddress?: Address}) => void
}

type DataUnionWithMetadata = TheGraphDataUnion & {
    name?: string,
}
export const DataUnionChainOption: FunctionComponent<DataUnionChainOptionProps> = ({
    index,
    chain,
    disabled= false,
    onChange,
}) => {
    const isMounted = useIsMounted()
    const account = useWalletAccount()
    const [ownedDataUnions, setOwnedDataUnions] = useState<DataUnionWithMetadata[]>([])
    const existingDUOptions = useMemo(() => ownedDataUnions.map((du) => ({label: truncate(du.name || du.id), value: du.id})), [ownedDataUnions])
    const [currentlySelectedOption] = useContext(DataUnionChainSelectorContext)
    const isSelected = useMemo(() => currentlySelectedOption === index, [currentlySelectedOption, index])
    const [deployNewDU, setDeployNewDU] = useState<boolean | undefined>(undefined)
    const [existingDUAddress, setExistingDUAddress] = useState<Address | undefined>(undefined)

    useEffect(() => {
        const load = async () => {
            if (account && chain.id) {
                const dataUnionsWithMetadata = []
                const dataUnionsOwned = await getDataUnionsOwnedByInChain(account, chain.id)

                for (const du of dataUnionsOwned) {
                    let duWithMetadata: DataUnionWithMetadata = du
                    const duObj = await getDataUnionObject(du.id, chain.id)
                    const metadata = await duObj.getMetadata()

                    if (typeof metadata === 'object') {
                        duWithMetadata = {
                            ...du,
                            name: metadata.name,
                        }
                    }

                    dataUnionsWithMetadata.push(duWithMetadata)
                }

                if (isMounted()) {
                    setOwnedDataUnions(dataUnionsWithMetadata)
                }
            }
        }
        load()
    }, [chain, account, isMounted])

    const handleSelect = useCallback(() => {
        if (currentlySelectedOption === index) {
            return
        }
        onChange({
            deployNewDU: true,
            existingDUAddress: undefined
        })
        setExistingDUAddress(undefined)
        setDeployNewDU(true)
    }, [currentlySelectedOption, index, onChange])

    const handleExistingDUSelect = useCallback((dataUnionAddress?: string) => {
        setDeployNewDU(false)
        if (dataUnionAddress) {
            setExistingDUAddress(dataUnionAddress)
        }
        onChange({
            deployNewDU: false,
            existingDUAddress: dataUnionAddress
        })

    }, [onChange])

    const handleSelectNewDU = useCallback(() => {
        setExistingDUAddress(undefined)
        setDeployNewDU(true)
        onChange({
            deployNewDU: true,
            existingDUAddress: undefined
        })
    }, [onChange])

    return <DropdownWrap>
        <DropdownToggle onClick={handleSelect} className={isSelected ? 'is-open' : ''}>
            <label>
                <StyledRadio
                    name={'data-union-chain-option'}
                    label={''}
                    value={''}
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => {
                        handleSelect()
                    }}/>
            </label>
            <ChainIcon chainId={chain.id} />
            <span>{formatChainName(chain.name)}</span>
        </DropdownToggle>
        <DropdownOuter className={isSelected ? 'is-open' : ''}>
            <DropdownInner className={isSelected ? 'is-open' : ''}>
                <Heading>Deployment</Heading>
                <SubHeading>You can deploy a new Data Union smart contract, or connect an existing one.</SubHeading>
                <DeploymentSelectContainer>
                    <DeploymentSelectorRadioContainer>
                        <StyledRadio
                            name={`${chain.name}-deployment`}
                            value={'new'}
                            label={'Deploy a new Data Union'}
                            checked={deployNewDU === true}
                            onChange={handleSelectNewDU}
                        />
                    </DeploymentSelectorRadioContainer>
                    <DeploymentSelectorRadioContainer>
                        <StyledRadio
                            name={`${chain.name}-deployment`}
                            value={'existing'}
                            label={'Connect an existing Data Union'}
                            checked={deployNewDU === false}
                            onChange={() => {
                                handleExistingDUSelect()
                            }}
                            className={'with-margin'}
                        />
                        <SelectField2
                            placeholder={existingDUOptions.length ? 'Select a Data Union' : 'You don\'t have any deployed Data Unions'}
                            options={existingDUOptions}
                            disabled={deployNewDU === true || !existingDUOptions.length}
                            fullWidth={true}
                            value={existingDUAddress}
                            isClearable={false}
                            onChange={(selectedDU) => {
                                handleExistingDUSelect(selectedDU)
                            }}/>
                    </DeploymentSelectorRadioContainer>
                </DeploymentSelectContainer>
            </DropdownInner>
        </DropdownOuter>
    </DropdownWrap>
}

const Heading = styled.p`
  font-size: 20px;
  line-height: 34px;
`

const SubHeading = styled.p`
  font-size: 16px;
`

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
  padding: 24px;
  transition: margin-bottom 0.5s ease-in-out;
  margin-bottom: -200%;
  
  &.is-open {
    margin-bottom: 0;
  }
`
const DropdownToggle = styled.div`
  padding: 12px 24px 12px 12px;
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

const StyledRadio = styled(Radio)`
  cursor: pointer;
  &.with-margin {
    margin-bottom: 24px;
  }
`

const ChainIcon = styled(NetworkIcon)`
  width: 32px;
  height: 32px;
  margin-right: 12px;
`

const DeploymentSelectContainer = styled.div`
  background-color: ${COLORS.inputBackground};
  padding: 24px;
`

const DeploymentSelectorRadioContainer = styled.div`
  background-color: white;
  padding: 24px;
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
`
