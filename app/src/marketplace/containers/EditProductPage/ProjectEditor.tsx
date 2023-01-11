import React, { FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import { ProjectPageContainer } from '$shared/components/ProjectPage'
import { ProjectHeroContainer } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import { CoverImage2 } from '$mp/containers/EditProductPage/CoverImage2'
import ProjectName from '$mp/containers/EditProductPage/ProjectName'
import ProjectDescription from '$mp/containers/EditProductPage/ProjectDescription'
import { ProjectDetails } from '$mp/containers/EditProductPage/ProjectDetails'
import { WhiteBox } from '$shared/components/WhiteBox'
import TokenSelector2 from '$mp/containers/EditProductPage/TokenSelector2'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { projectTypes } from '$mp/utils/constants'
import { DataUnionFee } from '$mp/containers/EditProductPage/DataUnionFee'
import { StreamSelector } from '$mp/containers/EditProductPage/StreamSelector'
import { TermsOfUse2 } from '$mp/containers/EditProductPage/TermsOfUse2'
import { BeneficiaryAddress2 } from '$mp/containers/EditProductPage/BeneficiaryAddress2'

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
        {(!project.isFree || project.type === projectTypes.DATAUNION) &&
            <WhiteBox>
                <TokenSelector2/>
                {project.type === projectTypes.DATAUNION && <DataUnionFee/>}
                <BeneficiaryAddress2/>
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
