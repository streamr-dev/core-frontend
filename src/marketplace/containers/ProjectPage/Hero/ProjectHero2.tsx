import React from 'react'
import Markdown from 'react-markdown'
import styled from 'styled-components'
import { DetailDisplay, DetailIcon, List } from '~/components/DetailDropdown'
import {
    ProjectHeroContainer,
    ProjectHeroImage,
    ProjectHeroMetadataContainer,
    ProjectHeroTitle,
} from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2.styles'
import { ParsedProject } from '~/parsers/ProjectParser'

interface Props {
    name: string
    description: string
    imageUrl: string | undefined
    contact: ParsedProject['contact']
}

export default function ProjectHero2({
    name,
    description: descriptionProp,
    imageUrl,
    contact,
}: Props) {
    const description = descriptionProp
        // Remove empty paragraphs
        .replace(/\\n/, '')
        // Remove spacers (extra empty lines)
        .replace(/^\s*\\\s*$/gm, '')

    return (
        <ProjectHeroContainer>
            <ProjectHeroImage
                src={imageUrl}
                alt={name}
                noBorderRadius
                key={imageUrl || ''}
            />
            <ProjectHeroTitle>{name}</ProjectHeroTitle>
            <MarkdownWrap>
                <Markdown
                    components={{
                        li({ children }) {
                            return (
                                <li>
                                    <p>{children}</p>
                                </li>
                            )
                        },
                    }}
                >
                    {description}
                </Markdown>
            </MarkdownWrap>
            <ProjectHeroMetadataContainer>
                <List>
                    {contact.url && (
                        <DetailDisplay
                            icon={<DetailIcon name="web" />}
                            value={contact.url}
                            href={contact.url}
                        />
                    )}
                    {contact.email && (
                        <DetailDisplay
                            icon={<DetailIcon name="email" />}
                            value={contact.email}
                            href={`mailto:${contact.email}`}
                        />
                    )}
                    {contact.twitter && (
                        <DetailDisplay
                            icon={<DetailIcon name="twitter" $color="#1da1f2" />}
                            href={contact.twitter}
                        />
                    )}
                    {contact.telegram && (
                        <DetailDisplay
                            icon={<DetailIcon name="telegram" $color="#2aabee" />}
                            href={contact.telegram}
                        />
                    )}
                    {contact.reddit && (
                        <DetailDisplay
                            icon={<DetailIcon name="reddit" $color="#ff5700" />}
                            href={contact.reddit}
                        />
                    )}
                    {contact.linkedIn && (
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

const MarkdownWrap = styled.div`
    line-height: 1.75;
    padding-right: 50px;

    > * + * {
        margin-top: 1em;
    }

    ol,
    ul {
        padding-left: 1.1em;
    }

    code {
        border-radius: 4px;
        border: 1px solid rgb(232, 235, 237);
        background: rgb(244, 247, 250);
        padding: 3px 4px;
        font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier,
            monospace;
        font-size: 80%;
    }

    blockquote {
        border-left: 3px solid rgb(232, 235, 237);
        padding: 0.5em;
        padding-left: 1em;
        font-style: italic;
    }

    blockquote > * + * {
        margin-top: 1em;
    }
`
