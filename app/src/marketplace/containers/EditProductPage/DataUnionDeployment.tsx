import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import useEditableState from '$shared/contexts/Undo/useEditableState'
import useEditableProductActions from '$mp/containers/ProductController/useEditableProductActions'
import SelectField from '$mp/components/SelectField'
import { getDataUnionObject, getDataUnionsOwnedByInChain, TheGraphDataUnion } from '$mp/modules/dataUnion/services'
import { selectUserData } from '$shared/modules/user/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { truncate } from '$shared/utils/text'

type Props = {
    disabled?: boolean
}

const Section = styled.section`
    background: none;
`

const Container = styled.div`
    background: #f1f1f1;
    border-radius: 4px;
    display: grid;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1.5em;
`

const Item = styled.div`
    background: #ffffff;
    border-radius: 4px;
    line-height: 64px;
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

const ExistingDataUnionContainer = styled.div`
    display: grid;
    grid-template-rows: auto auto;
    margin: 0 24px 24px 48px;
`

enum DeploymentType {
    NEW = 'NEW',
    EXISTING = 'EXISTING',
}

type DataUnionWithMetadata = TheGraphDataUnion & {
    name?: string,
}

const DataUnionDeployment: React.FC<Props> = ({ disabled }: Props) => {
    const isMounted = useIsMounted()
    const currentUser = useSelector(selectUserData)
    const currentUserName = currentUser && currentUser.username
    const { state: product } = useEditableState()
    const beneficiaryAddress = product && product.beneficiaryAddress
    const chainId = product && getChainIdFromApiString(product.chain)
    const { updateExistingDUAddress, updateBeneficiaryAddress } = useEditableProductActions()
    const [selection, setSelection] = useState<DeploymentType>(beneficiaryAddress ? DeploymentType.EXISTING : DeploymentType.NEW)
    const [selectedDataUnion, setSelectedDataUnion] = useState(beneficiaryAddress ? ({
        label: beneficiaryAddress,
        value: beneficiaryAddress,
    }) : null)
    const [ownedDataUnions, setOwnedDataUnions] = useState([])

    const options = useMemo(() => ownedDataUnions.map((du) => ({
        label: du.name ? `${du.name} (${truncate(du.id)})` : du.id,
        value: du.id,
    })), [ownedDataUnions])

    useEffect(() => {
        const load = async () => {
            if (currentUserName && chainId) {
                const dataUnionsWithMetadata = []
                const dataUnionsOwned = await getDataUnionsOwnedByInChain(currentUserName, chainId)

                for (const du of dataUnionsOwned) {
                    let duWithMetadata: DataUnionWithMetadata = du
                    const duObj = await getDataUnionObject(du.id, chainId)
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
    }, [currentUserName, chainId, isMounted])

    useEffect(() => {
        const selectedDuAddress = selectedDataUnion && selectedDataUnion.value
        if (selectedDuAddress != null && beneficiaryAddress !== selectedDuAddress) {
            updateExistingDUAddress(selectedDataUnion.value)
        }
    }, [selectedDataUnion, updateExistingDUAddress, beneficiaryAddress])

    return (
        <Section id="deployment">
            <div>
                <h1>Deployment</h1>
                <p>You can deploy a new Data Union smart contract, or connect an existing one to eventually publish it on the Marketplace.</p>

                <Container>
                    <Item>
                        <RadioContainer htmlFor="new">
                            <Radio
                                id="new"
                                type="radio"
                                name="deploy"
                                checked={selection === DeploymentType.NEW}
                                onChange={() => {
                                    setSelection(DeploymentType.NEW)
                                    updateExistingDUAddress(null)
                                    updateBeneficiaryAddress(null)
                                }}
                                disabled={disabled}
                            />
                            Deploy a new Data Union
                        </RadioContainer>
                    </Item>
                    <Item>
                        <RadioContainer htmlFor="existing">
                            <Radio
                                id="existing"
                                type="radio"
                                name="deploy"
                                checked={selection === DeploymentType.EXISTING}
                                onChange={() => {
                                    setSelection(DeploymentType.EXISTING)
                                    const selectedDuAddress = selectedDataUnion && selectedDataUnion.value
                                    updateExistingDUAddress(selectedDuAddress)
                                    updateBeneficiaryAddress(null)
                                }}
                                disabled={disabled}
                            />
                            Connect an existing Data Union
                        </RadioContainer>
                        <ExistingDataUnionContainer>
                            <SelectField
                                placeholder="Select a Data Union"
                                options={options}
                                value={selectedDataUnion}
                                onChange={(value) => setSelectedDataUnion(value)}
                                disabled={disabled || selection !== DeploymentType.EXISTING}
                                noOptionsMessage={() => "No Data Unions deployed on this chain"}
                            />
                        </ExistingDataUnionContainer>
                    </Item>
                </Container>
            </div>
        </Section>
    )
}

export default DataUnionDeployment
