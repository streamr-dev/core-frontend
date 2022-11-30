import React, { FunctionComponent } from 'react'
import { Project } from '$mp/types/project-types'
import {
    ProjectHeroContainer,
    ProjectHeroDescription,
    ProjectHeroImage,
    ProjectHeroMarkdownText,
    ProjectHeroSignalContainer,
    ProjectHeroTitle
} from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import Button from '$shared/components/Button'

export type ProjectHeroProps = {
    project: Project
}

export const ProjectHero2: FunctionComponent<ProjectHeroProps> = ({project}) => {
    return <ProjectHeroContainer>
        <ProjectHeroImage src={project.imageUrl} alt={project.name} noBorderRadius={true}/>
        <ProjectHeroTitle>{project.name}</ProjectHeroTitle>
        <ProjectHeroDescription><ProjectHeroMarkdownText text={project.description}/></ProjectHeroDescription>
        {/*<ProjectHeroSignalContainer>
            <p>
                <span>Total signal</span>
                <strong>120k DATA</strong>
            </p>
            <Button kind={'primary'} outline>Signal</Button>
        </ProjectHeroSignalContainer>*/}
    </ProjectHeroContainer>
}

