import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import { ProjectPageContainer } from '$shared/components/ProjectPage'
import { ProjectHeroContainer } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import { CoverImage2 } from '$mp/containers/EditProductPage/CoverImage2'
import ProjectName from '$mp/containers/EditProductPage/ProjectName'
import ProjectDescription from '$mp/containers/EditProductPage/ProjectDescription'
import { ProjectDetails } from '$mp/containers/EditProductPage/ProjectDetails'
import { WhiteBox } from '$shared/components/WhiteBox'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { ProjectTypeEnum } from '$mp/utils/constants'
import { DataUnionFee } from '$mp/containers/EditProductPage/DataUnionFee'
import { StreamSelector } from '$mp/containers/EditProductPage/StreamSelector'
import { TermsOfUse2 } from '$mp/containers/EditProductPage/TermsOfUse2'
import { SalePointSelector } from '$mp/containers/EditProductPage/SalePointSelector/SalePointSelector'

type ProjectEditorProps = {
    disabled?: boolean
}

const WhiteBoxWithMargin = styled(WhiteBox)`
  margin-top: 24px;
`

export const ProjectEditor: FunctionComponent<ProjectEditorProps> = ({disabled}) => {
    const {state: project} = useContext(ProjectStateContext)

    return <ProjectPageContainer>
        <ProjectHeroContainer overflowVisible={true}>
            <CoverImage2 disabled={disabled} />
            <ProjectName/>
            <ProjectDescription/>
            <ProjectDetails/>
        </ProjectHeroContainer>
        {project.type === ProjectTypeEnum.PAID_DATA &&
            <WhiteBox>
                <SalePointSelector/>
            </WhiteBox>
        }
        <WhiteBoxWithMargin>
            <StreamSelector />
        </WhiteBoxWithMargin>
        <WhiteBoxWithMargin>
            <TermsOfUse2/>
        </WhiteBoxWithMargin>
    </ProjectPageContainer>
}
