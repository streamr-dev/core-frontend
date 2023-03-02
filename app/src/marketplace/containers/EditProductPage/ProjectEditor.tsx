import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import { ProjectPageContainer } from '$shared/components/ProjectPage'
import { ProjectHeroContainer } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import { CoverImage } from '$mp/containers/EditProductPage/CoverImage'
import ProjectName from '$mp/containers/EditProductPage/ProjectName'
import ProjectDescription from '$mp/containers/EditProductPage/ProjectDescription'
import { ProjectDetails } from '$mp/containers/EditProductPage/ProjectDetails'
import { WhiteBox } from '$shared/components/WhiteBox'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { ProjectTypeEnum } from '$mp/utils/constants'
import { StreamSelector } from '$mp/containers/EditProductPage/StreamSelector'
import { TermsOfUse } from '$mp/containers/EditProductPage/TermsOfUse'
import { SalePointSelector } from '$mp/containers/EditProductPage/SalePointSelector/SalePointSelector'
import { DataUnionChainSelector } from '$mp/containers/EditProductPage/DataUnionChainSelector/DataUnionChainSelector'
import { DataUnionTokenSelector } from '$mp/containers/EditProductPage/DataUnionTokenSelector/DataUnionTokenSelector'
import { DataUnionFee } from '$mp/containers/EditProductPage/DataUnionFee'

type ProjectEditorProps = {
    nonEditableSalePointChains?: number[] // array of chain ids
}

const WhiteBoxWithMargin = styled(WhiteBox)`
  margin-top: 24px;
`

export const ProjectEditor: FunctionComponent<ProjectEditorProps> = ({nonEditableSalePointChains = []}) => {
    const {state: project} = useContext(ProjectStateContext)

    return <ProjectPageContainer>
        <ProjectHeroContainer overflowVisible={true}>
            <CoverImage />
            <ProjectName/>
            <ProjectDescription/>
            <ProjectDetails/>
        </ProjectHeroContainer>
        {project.type === ProjectTypeEnum.PAID_DATA &&
            <WhiteBox>
                <SalePointSelector nonEditableSalePointChains={nonEditableSalePointChains}/>
            </WhiteBox>
        }
        {project.type === ProjectTypeEnum.DATA_UNION && <>
            <WhiteBox>
                <DataUnionChainSelector/>
            </WhiteBox>
            <WhiteBoxWithMargin>
                <DataUnionTokenSelector/>
                <DataUnionFee/>
            </WhiteBoxWithMargin>
        </>}
        <WhiteBoxWithMargin>
            <StreamSelector />
        </WhiteBoxWithMargin>
        <WhiteBoxWithMargin>
            <TermsOfUse/>
        </WhiteBoxWithMargin>
    </ProjectPageContainer>
}
