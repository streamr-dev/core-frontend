import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { DetailEditor, DetailEditorSelectOption } from '$shared/components/DetailEditor'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS, LAPTOP } from '$shared/utils/styled'
import NetworkIcon from '$shared/components/NetworkIcon'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useEditableProductActions from '$mp/containers/ProductController/useEditableProductActions'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { projectTypes } from '$mp/utils/constants'
import { getConfigForChain, getConfigForChainByName } from '$shared/web3/config'
import { projectStates } from '$shared/utils/constants'
import { configChainNameMapping } from './projectChain.utils'

const ProjectDetailsWrap = styled.div`
  display: flex;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 4;
  grid-row-end: 4;
  margin-top: 24px;

  @media(${LAPTOP}) {
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 3;
    grid-row-end: 3;
    margin: 50px;
  }
  
  .detail {
    flex-shrink: 1;
    margin-right: 6px;
  }
`

const StandardIcon = styled(SvgIcon)`
  color: ${COLORS.primary};
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  &.twitterBlue {
    color: #1DA1F2
  }
`

const ChainIcon = styled(NetworkIcon)`
  width: 32px;
  height: 32px;
  &.preview {
    width: 16px;
    height: 16px;
  }
`

const ChainOption = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    margin-left: 12px;
  }
`

const getChainOptions = (chains: Array<string>): DetailEditorSelectOption[] =>
    chains.map((c) => {
        const config = getConfigForChainByName(c)
        const chainId = config.id
        return {
            value: chainId,
            label: <ChainOption><ChainIcon chainId={chainId} /><span>{configChainNameMapping[config.name]}</span></ChainOption>
        }
    })

export const ProjectDetails: FunctionComponent = () => {
    const { state: project } = useEditableState()
    const isDataUnion = isDataUnionProduct(project)
    const isPaid = isPaidProduct(project)
    const isChainSelectorDisabled =
        project.state === projectStates.DEPLOYED ||
        (project.type === projectTypes.DATAUNION && project.beneficiaryAddress != null)
    const { updateChain } = useEditableProductActions()
    const productType = project.type
    const productChain = project.chain
    const { marketplaceChains, dataunionChains } = getCoreConfig()
    const chainOptions = useMemo<DetailEditorSelectOption[]>(() => {
        let options: DetailEditorSelectOption[] = []

        if (productType === projectTypes.DATAUNION) {
            options = getChainOptions(dataunionChains)
        } else {
            options = getChainOptions(marketplaceChains)
        }

        return options
    }, [productType, marketplaceChains, dataunionChains])
    return <ProjectDetailsWrap>
        {/*{(isDataUnion || isPaid) &&
            <DetailEditor
                className={'detail'}
                unsetValueText={'Chain'}
                defaultIcon={<StandardIcon name={'ellipse'}/>}
                showValue={true}
                instructionText={'Please select a chain'}
                onChange={console.log}
                placeholder={'Select...'}
                value={productChain}
                selectOptions={chainOptions}
                showValueFormatter={(chainId) => {
                    const chain = getConfigForChain(chainId)
                    return chain?.name
                }}
            />
        }*/}
        <DetailEditor
            className={'detail'}
            unsetValueText={'Site URL'}
            defaultIcon={<StandardIcon name={'web'}/>}
            showValue={true}
            instructionText={'Please add a site URL'}
            ctaButtonText={'site URL'}
            placeholder={'https://siteinfo.com'}
            onChange={console.log}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
        <DetailEditor
            className={'detail'}
            unsetValueText={'Contact email'}
            defaultIcon={<StandardIcon name={'email'}/>}
            showValue={true}
            instructionText={'Please add a contact email'}
            ctaButtonText={'contact email'}
            placeholder={'owner@example.com'}
            onChange={console.log}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().email()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid email address'
            }]}
            value={'john.the.admin@verylongcompanyname.com'}
        />
        <DetailEditor
            className={'detail'}
            defaultIcon={<StandardIcon name={'twitter'}/>}
            instructionText={'Please add Twitter link'}
            ctaButtonText={'Twitter link'}
            onChange={console.log}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
        <DetailEditor
            className={'detail'}
            defaultIcon={<StandardIcon name={'telegram'}/>}
            instructionText={'Please add Telegram link'}
            ctaButtonText={'Telegram link'}
            onChange={console.log}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
        <DetailEditor
            className={'detail'}
            defaultIcon={<StandardIcon name={'reddit'}/>}
            instructionText={'Please add Reddit link'}
            ctaButtonText={'Reddit link'}
            onChange={console.log}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
        <DetailEditor
            defaultIcon={<StandardIcon name={'linkedin'}/>}
            instructionText={'Please add LinkedIn link'}
            ctaButtonText={'LinkedIn link'}
            onChange={console.log}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
        />
    </ProjectDetailsWrap>
}
