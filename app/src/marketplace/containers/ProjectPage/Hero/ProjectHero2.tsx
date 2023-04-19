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

interface Props {
    name: string
    description: string
    imageUrl: string | undefined
    contact: Project['contact']
}

export default function ProjectHero2({ name, description, imageUrl, contact = {} }: Props) {
    return (
        <ProjectHeroContainer>
            <ProjectHeroImage src={imageUrl} alt={name} noBorderRadius={true} key={imageUrl || ''} />
            <ProjectHeroTitle>{name}</ProjectHeroTitle>
            <DescriptionEditor value={description} readOnly={true} theme={customTheme} />
            <ProjectHeroMetadataContainer>
                {contact && (
                    <>
                        {contact.url && (
                            <DetailDisplay icon={<ProjectDetailIcon name={'web'} />} value={contact.url} link={contact.url} />
                        )}
                        {contact.email && (
                            <DetailDisplay
                                icon={<ProjectDetailIcon name={'email'} />}
                                value={contact.email}
                                link={'mailto:' + contact.email}
                            />
                        )}
                        {contact.twitter && (
                            <DetailDisplay icon={<ProjectDetailIcon name={'twitter'} className={'twitterColor'} />} link={contact.twitter} />
                        )}
                        {contact.telegram && (
                            <DetailDisplay
                                icon={<ProjectDetailIcon name={'telegram'} className={'telegramColor'} />}
                                link={contact.telegram}
                            />
                        )}
                        {contact.reddit && (
                            <DetailDisplay icon={<ProjectDetailIcon name={'reddit'} className={'redditColor'} />} link={contact.reddit} />
                        )}
                        {contact.linkedIn && (
                            <DetailDisplay
                                icon={<ProjectDetailIcon name={'linkedin'} className={'linkedInColor'} />}
                                link={contact.linkedIn}
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

