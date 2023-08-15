import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ProjectPageContainer } from '~/shared/components/ProjectPage'
import { ProjectHeroContainer } from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2.styles'
import { CoverImage } from '~/marketplace/containers/ProjectEditing/CoverImage'
import ProjectName from '~/marketplace/containers/ProjectEditing/ProjectName'
import ProjectDescription from '~/marketplace/containers/ProjectEditing/ProjectDescription'
import { ProjectDetails } from '~/marketplace/containers/ProjectEditing/ProjectDetails'
import { WhiteBox } from '~/shared/components/WhiteBox'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
import { ProjectType, SalePoint } from '~/shared/types'
import { StreamSelector } from '~/marketplace/containers/ProjectEditing/StreamSelector'
import { TermsOfUse } from '~/marketplace/containers/ProjectEditing/TermsOfUse'
import { SalePointSelector } from '~/marketplace/containers/ProjectEditing/SalePointSelector/SalePointSelector'
import { DataUnionChainSelector } from '~/marketplace/containers/ProjectEditing/DataUnionChainSelector/DataUnionChainSelector'
import { DataUnionTokenSelector } from '~/marketplace/containers/ProjectEditing/DataUnionTokenSelector/DataUnionTokenSelector'
import { DataUnionFee } from '~/marketplace/containers/ProjectEditing/DataUnionFee'
import { ProjectControllerContext } from '~/marketplace/containers/ProjectEditing/ProjectController'
import { DataUnionSecretsContextProvider } from '~/marketplace/modules/dataUnion/dataUnionSecretsContext'
import { ProjectPermission, useProjectAbility } from '~/shared/stores/projectAbilities'
import { useWalletAccount } from '~/shared/stores/wallet'
import { defaultChainConfig } from '~/getters/getChainConfig'
import DeleteProject from './DeleteProject'
import { DataUnionSecrets } from './DataUnionSecrets'
import SalePointSelector2 from '~/components/SalePointSelector'
import { timeUnits } from '~/shared/utils/timeUnit'

type ProjectEditorProps = {
    nonEditableSalePointChains?: number[] // array of chain ids
    editMode?: boolean
}

const WhiteBoxWithMargin = styled(WhiteBox)`
    margin-top: 24px;
`

const TransparentBoxWithMargin = styled(WhiteBoxWithMargin)`
    background-color: transparent;
    border: 1px solid #cdcdcd;
`

const EditorOverlay = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 2px;
    left: 0;
    background-color: white;
    opacity: 0.6;
`

export const ProjectEditor: FunctionComponent<ProjectEditorProps> = ({
    nonEditableSalePointChains = [],
    editMode = false,
}) => {
    const { state: project } = useContext(ProjectStateContext)
    const { publishInProgress } = useContext(ProjectControllerContext)
    const chainId = defaultChainConfig.id
    const canDelete = useProjectAbility(
        chainId,
        project?.id || undefined,
        useWalletAccount(),
        ProjectPermission.Delete,
    )

    const salePoints = useMemo(() => {
        const result: Record<number, SalePoint | undefined> = {}

        Object.entries(project.salePoints || {}).forEach(
            ([
                cid,
                {
                    chainId,
                    beneficiaryAddress = '',
                    pricePerSecond,
                    timeUnit,
                    price,
                    pricingTokenAddress = '',
                },
            ]) => {
                result[+cid] = {
                    beneficiaryAddress,
                    chainId,
                    price: price ? price.toString() : '',
                    pricePerSecond: pricePerSecond ? pricePerSecond.toString() : '',
                    timeUnit: timeUnit || timeUnits.day,
                    pricingTokenAddress,
                }
            },
        )

        return result
    }, [project.salePoints])

    const [selectedChainIds, setSelectedChainIds] = useState<
        Record<number, boolean | undefined>
    >({})

    const [customSalePoints, setCustomSalePoints] =
        useState<typeof salePoints>(salePoints)

    useEffect(() => {
        setCustomSalePoints(salePoints)
    }, [salePoints])

    return (
        <ProjectPageContainer>
            <ProjectHeroContainer overflowVisible={true}>
                <CoverImage />
                <ProjectName />
                <ProjectDescription />
                <ProjectDetails />
            </ProjectHeroContainer>
            {project?.type === ProjectType.PaidData && (
                <>
                    <WhiteBox className={'with-padding'}>
                        <SalePointSelector
                            nonEditableSalePointChains={nonEditableSalePointChains}
                        />
                    </WhiteBox>
                    <WhiteBox className={'with-padding'}>
                        <SalePointSelector2
                            salePoints={customSalePoints}
                            onSalePointsChange={(value) => {
                                setCustomSalePoints(value)
                            }}
                            selectedChainIds={selectedChainIds}
                            onSelectedChainIdsChange={setSelectedChainIds}
                        />
                    </WhiteBox>
                </>
            )}
            {project?.type === ProjectType.DataUnion && (
                <>
                    {/* Show chain selector only for new projects as it cannot be changed */}
                    {project?.id == null && (
                        <WhiteBox className={'with-padding'}>
                            <DataUnionChainSelector editMode={editMode} />
                        </WhiteBox>
                    )}
                    <WhiteBoxWithMargin className={'with-padding'}>
                        <DataUnionTokenSelector editMode={editMode} />
                        <DataUnionFee />
                    </WhiteBoxWithMargin>
                </>
            )}
            <WhiteBoxWithMargin className={'with-padding'}>
                <StreamSelector />
            </WhiteBoxWithMargin>
            <WhiteBoxWithMargin className={'with-padding'}>
                <TermsOfUse />
            </WhiteBoxWithMargin>
            {project?.type === ProjectType.DataUnion &&
                project.existingDUAddress != null && (
                    <WhiteBoxWithMargin className={'with-padding'}>
                        <DataUnionSecretsContextProvider>
                            <DataUnionSecrets />
                        </DataUnionSecretsContextProvider>
                    </WhiteBoxWithMargin>
                )}
            {project?.id && canDelete && (
                <TransparentBoxWithMargin className={'with-padding'}>
                    <DeleteProject />
                </TransparentBoxWithMargin>
            )}
            {publishInProgress && <EditorOverlay />}
        </ProjectPageContainer>
    )
}
