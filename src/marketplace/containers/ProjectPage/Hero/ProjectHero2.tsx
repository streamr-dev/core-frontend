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
import { DetailDisplay } from '~/shared/components/DetailEditor/DetailDisplay'
import { DetailIcon } from '~/components/DetailDropdown'

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
                noBorderRadius={true}
                key={imageUrl || ''}
            />
            <ProjectHeroTitle>{name}</ProjectHeroTitle>
            <DescriptionEditor value={description} readOnly={true} theme={customTheme} />
            <ProjectHeroMetadataContainer>
                {contact && (
                    <>
                        {contact.url && (
                            <DetailDisplay
                                icon={<DetailIcon name="web" />}
                                value={contact.url}
                                link={contact.url}
                            />
                        )}
                        {contact.email && (
                            <DetailDisplay
                                icon={<DetailIcon name="email" />}
                                value={contact.email}
                                link={'mailto:' + contact.email}
                            />
                        )}
                        {contact.twitter && (
                            <DetailDisplay
                                icon={<DetailIcon name="twitter" $color="#1da1f2" />}
                                link={contact.twitter}
                            />
                        )}
                        {contact.telegram && (
                            <DetailDisplay
                                icon={<DetailIcon name="telegram" $color="#2aabee" />}
                                link={contact.telegram}
                            />
                        )}
                        {contact.reddit && (
                            <DetailDisplay
                                icon={<DetailIcon name="reddit" $color="#ff5700" />}
                                link={contact.reddit}
                            />
                        )}
                        {contact.linkedIn && (
                            <DetailDisplay
                                icon={<DetailIcon name="linkedin" $color="#0077b5" />}
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
