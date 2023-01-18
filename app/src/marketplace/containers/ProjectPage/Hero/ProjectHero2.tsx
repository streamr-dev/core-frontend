import React, { FunctionComponent } from 'react'
import Editor from "rich-markdown-editor"
import styled from 'styled-components'
import light from 'rich-markdown-editor/dist/styles/theme'
import { Project } from '$mp/types/project-types'
import {
    ProjectHeroContainer,
    ProjectHeroDescriptionStyles,
    ProjectHeroImage,
    ProjectHeroSignalContainer,
    ProjectHeroTitle
} from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import Button from '$shared/components/Button'
import { COLORS } from '$shared/utils/styled'

export type ProjectHeroProps = {
    project: Project
}

const DescriptionEditor = styled(Editor)`
  ${ProjectHeroDescriptionStyles};
  justify-content: flex-start;
  
  .block-menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const customTheme = {
    ...light,
    toolbarBackground: COLORS.primaryContrast,
    toolbarHoverBackground: COLORS.primaryDisabled,
    toolbarItem: COLORS.primaryLight,
    placeholder: COLORS.primaryDisabled,
    link: COLORS.link,
    text: COLORS.primaryLight
}

export const ProjectHero2: FunctionComponent<ProjectHeroProps> = ({project}) => {
    return <ProjectHeroContainer>
        <ProjectHeroImage src={project.imageUrl} alt={project.name} noBorderRadius={true}/>
        <ProjectHeroTitle>{project.name}</ProjectHeroTitle>
        <DescriptionEditor
            value={project.description}
            readOnly={true}
            theme={customTheme}
        />
        {/*<ProjectHeroSignalContainer>
            <p>
                <span>Total signal</span>
                <strong>120k DATA</strong>
            </p>
            <Button kind={'primary'} outline>Signal</Button>
        </ProjectHeroSignalContainer>*/}
    </ProjectHeroContainer>
}

