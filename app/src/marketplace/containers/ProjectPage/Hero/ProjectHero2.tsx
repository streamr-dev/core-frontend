import React, { FunctionComponent } from 'react'
import Editor from "rich-markdown-editor"
import styled from 'styled-components'
import light from 'rich-markdown-editor/dist/styles/theme'
import { Project } from '$mp/types/project-types'
import {
    ProjectHeroContainer,
    ProjectHeroDescriptionStyles,
    ProjectHeroImage,
    ProjectHeroMetadataContainer,
    ProjectHeroSignalContainer,
    ProjectHeroTitle
} from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import { COLORS } from '$shared/utils/styled'
import {DetailDisplay} from "$shared/components/DetailEditor/DetailDisplay"
import {ProjectDetailIcon} from "$mp/containers/ProjectEditing/ProjectDetails.styles"

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
    return (
        <ProjectHeroContainer>
            <ProjectHeroImage src={project.imageUrl} alt={project.name} noBorderRadius={true} />
            <ProjectHeroTitle>{project.name}</ProjectHeroTitle>
            <DescriptionEditor value={project.description} readOnly={true} theme={customTheme} />
            <ProjectHeroMetadataContainer>
                {project.contact && (
                    <>
                        {project.contact.url && (
                            <DetailDisplay icon={<ProjectDetailIcon name={'web'} />} value={project.contact.url} link={project.contact.url} />
                        )}
                        {project.contact.email && (
                            <DetailDisplay
                                icon={<ProjectDetailIcon name={'email'} />}
                                value={project.contact.email}
                                link={'mailto:' + project.contact.email}
                            />
                        )}
                        {project.contact.twitter && (
                            <DetailDisplay icon={<ProjectDetailIcon name={'twitter'} className={'twitterColor'} />} link={project.contact.twitter} />
                        )}
                        {project.contact.telegram && (
                            <DetailDisplay
                                icon={<ProjectDetailIcon name={'telegram'} className={'telegramColor'} />}
                                link={project.contact.telegram}
                            />
                        )}
                        {project.contact.reddit && (
                            <DetailDisplay icon={<ProjectDetailIcon name={'reddit'} className={'redditColor'} />} link={project.contact.reddit} />
                        )}
                        {project.contact.linkedIn && (
                            <DetailDisplay
                                icon={<ProjectDetailIcon name={'linkedin'} className={'linkedInColor'} />}
                                link={project.contact.linkedIn}
                            />
                        )}
                    </>
                )}
            </ProjectHeroMetadataContainer>
            {/*<ProjectHeroSignalContainer>
            <p>
                <span>Total signal</span>
                <strong>120k DATA</strong>
            </p>
            <Button kind={'primary'} outline>Signal</Button>
        </ProjectHeroSignalContainer>*/}
        </ProjectHeroContainer>
    )
}

