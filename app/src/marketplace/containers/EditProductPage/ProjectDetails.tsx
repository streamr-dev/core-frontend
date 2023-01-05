import React, { FunctionComponent, ReactNode, useContext, useMemo } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { DetailEditor, DetailEditorSelectOption } from '$shared/components/DetailEditor'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS, LAPTOP } from '$shared/utils/styled'
import NetworkIcon from '$shared/components/NetworkIcon'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { projectTypes } from '$mp/utils/constants'
import { getConfigForChainByName } from '$shared/web3/config'
import { projectStates } from '$shared/utils/constants'
import { configChainNameMapping } from '$shared/utils/chains'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'

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
  &.twitterColor {
    color: #1DA1F2;
  }
  &.telegramColor {
    color: #2AABEE;
  }
  &.redditColor {
    color: #FF5700;
  }
  &.linkedInColor {
    color: #0077B5;
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
            value: config.name,
            label: <ChainOption><ChainIcon chainId={chainId} /><span>{configChainNameMapping[config.name]}</span></ChainOption>
        }
    })

export const ProjectDetails: FunctionComponent = () => {
    const { state: project } = useContext(ProjectStateContext)
    const isDataUnion = isDataUnionProduct(project)
    const isPaid = isPaidProduct(project)
    const isChainSelectorDisabled =
        project.state === projectStates.DEPLOYED ||
        (project.type === projectTypes.DATAUNION && !!project.beneficiaryAddress)
    const { updateChain, updateContactUrl, updateContactEmail, updateSocialUrl } = useEditableProjectActions()
    const productType = project.type
    const projectChain = project.chain
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
    const currentChainIcon = useMemo<ReactNode>(() => {
        if (!projectChain) {
            return undefined
        }
        const config = getConfigForChainByName(projectChain)
        return <ChainIcon chainId={config.id} className={'preview'}/>
    }, [projectChain])

    return <ProjectDetailsWrap>
        <DetailEditor
            disabled={isChainSelectorDisabled}
            className={'detail'}
            unsetValueText={'Chain'}
            defaultIcon={<StandardIcon name={'ellipse'}/>}
            hasValueIcon={currentChainIcon}
            showValue={true}
            instructionText={'Please select a chain'}
            onChange={updateChain}
            placeholder={'Select...'}
            value={projectChain}
            selectOptions={chainOptions}
            showValueFormatter={(chainName) => {
                return chainName ? configChainNameMapping[chainName] : ''
            }}
        />
        <DetailEditor
            className={'detail'}
            unsetValueText={'Site URL'}
            defaultIcon={<StandardIcon name={'web'}/>}
            showValue={true}
            instructionText={'Please add a site URL'}
            ctaButtonText={'site URL'}
            placeholder={'https://siteinfo.com'}
            onChange={updateContactUrl}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().url()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid URL'
            }]}
            value={project?.contact?.url || ''}
        />
        <DetailEditor
            className={'detail'}
            unsetValueText={'Contact email'}
            defaultIcon={<StandardIcon name={'email'}/>}
            showValue={true}
            instructionText={'Please add a contact email'}
            ctaButtonText={'contact email'}
            placeholder={'owner@example.com'}
            onChange={updateContactEmail}
            optional={true}
            validation={[{
                validator: (value) => {
                    const schema = yup.string().trim().email()
                    return !!schema.isValidSync(value)
                },
                message: 'Not a valid email address'
            }]}
            value={project?.contact?.email || ''}
        />
        <DetailEditor
            className={'detail'}
            defaultIcon={<StandardIcon name={'twitter'}/>}
            instructionText={'Please add Twitter link'}
            ctaButtonText={'Twitter link'}
            hasValueIcon={!!project?.contact?.social1 && <StandardIcon name={'twitter'} className={'twitterColor'}/>}
            value={project?.contact?.social1}
            onChange={(value) => updateSocialUrl('twitter', value)}
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
            hasValueIcon={!!project?.contact?.social2 && <StandardIcon name={'telegram'} className={'telegramColor'}/>}
            value={project?.contact?.social2}
            onChange={(value) => updateSocialUrl('telegram', value)}
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
            hasValueIcon={!!project?.contact?.social3 && <StandardIcon name={'reddit'} className={'redditColor'}/>}
            value={project?.contact?.social3}
            onChange={(value) => updateSocialUrl('reddit', value)}
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
            hasValueIcon={!!project?.contact?.social4 && <StandardIcon name={'linkedin'} className={'linkedInColor'}/>}
            value={project?.contact?.social4}
            onChange={(value) => updateSocialUrl('linkedin', value)}
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
