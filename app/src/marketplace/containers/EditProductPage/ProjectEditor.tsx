import React, { FunctionComponent } from 'react'
import { ProjectPageContainer } from '$shared/components/ProjectPage'
import { ProjectHeroContainer } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import { CoverImage2 } from '$mp/containers/EditProductPage/CoverImage2'
import ProjectName from '$mp/containers/EditProductPage/ProjectName'
import ProjectDescription from '$mp/containers/EditProductPage/ProjectDescription'
import { ProjectDetails } from '$mp/containers/EditProductPage/ProjectDetails'
import { WhiteBox } from '$shared/components/WhiteBox'
import TokenSelector2 from '$mp/containers/EditProductPage/TokenSelector2'

type ProjectEditorProps = {
    disabled?: boolean
}

export const ProjectEditor: FunctionComponent<ProjectEditorProps> = ({disabled}) => {
    return <ProjectPageContainer>
        <ProjectHeroContainer overflowVisible={true}>
            <CoverImage2 disabled={disabled} />
            <ProjectName/>
            <ProjectDescription/>
            <ProjectDetails/>
        </ProjectHeroContainer>
        <WhiteBox>
            <TokenSelector2/>
        </WhiteBox>
    </ProjectPageContainer>
}
