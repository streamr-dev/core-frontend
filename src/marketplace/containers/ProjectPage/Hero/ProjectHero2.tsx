import React from 'react'
import styled from 'styled-components'
import Editor from 'rich-markdown-editor'
import light from 'rich-markdown-editor/dist/styles/theme'
import { Project } from '~/marketplace/types/project-types'
import {
    ProjectHeroContainer,
    ProjectHeroDescriptionStyles,
    ProjectHeroImage,
    ProjectHeroMetadataContainer,
    ProjectHeroTitle,
} from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2.styles'
import { COLORS } from '~/shared/utils/styled'
import { DetailIcon, DetailDisplay, List } from '~/components/DetailDropdown'

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
    text: COLORS.primaryLight,
}

interface Props {
    name: string
    description: string
    imageUrl: string | undefined
    contact: Project['contact']
}

export default function ProjectHero2({
    name,
    description,
    imageUrl,
    contact = {},
}: Props) {
    return (
        <ProjectHeroContainer>
            <ProjectHeroImage
                src={imageUrl}
                alt={name}
                noBorderRadius
                key={imageUrl || ''}
            />
            <ProjectHeroTitle>{name}</ProjectHeroTitle>
            <DescriptionEditor value={description} readOnly theme={customTheme} />
            <ProjectHeroMetadataContainer>
                <List>
                    {contact?.url && (
                        <DetailDisplay
                            icon={<DetailIcon name="web" />}
                            value={contact.url}
                            href={contact.url}
                        />
                    )}
                    {contact?.email && (
                        <DetailDisplay
                            icon={<DetailIcon name="email" />}
                            value={contact.email}
                            href={`mailto:${contact.email}`}
                        />
                    )}
                    {contact?.twitter && (
                        <DetailDisplay
                            icon={<DetailIcon name="twitter" $color="#1da1f2" />}
                            href={contact.twitter}
                        />
                    )}
                    {contact?.telegram && (
                        <DetailDisplay
                            icon={<DetailIcon name="telegram" $color="#2aabee" />}
                            href={contact.telegram}
                        />
                    )}
                    {contact?.reddit && (
                        <DetailDisplay
                            icon={<DetailIcon name="reddit" $color="#ff5700" />}
                            href={contact.reddit}
                        />
                    )}
                    {contact?.linkedIn && (
                        <DetailDisplay
                            icon={<DetailIcon name="linkedin" $color="#0077b5" />}
                            href={contact.linkedIn}
                        />
                    )}
                </List>
            </ProjectHeroMetadataContainer>
        </ProjectHeroContainer>
    )
}
