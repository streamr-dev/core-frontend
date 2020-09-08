// @flow

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { MD } from '$shared/utils/styled'

type Props = {
    text: string,
    className?: string,
}

const ALLOWED_MARKDOWN = [
    'text',
    'paragraph',
    'break',
    'emphasis',
    'strong',
    'thematicBreak',
    'blockquote',
    'delete',
    'link',
    'list',
    'listItem',
    'inlineCode',
    'code',
]

const Root = styled.div`
    color: var(--greyDark2);
    line-height: 30px;
    font-size: 18px;
    letter-spacing: 0;
`

const MarkdownContainer = styled.div`
    position: relative;
    font-size: 1.125rem;
    letter-spacing: 0;
    line-height: 1.875rem;
    padding-left: 1.5rem;

    p {
        margin-bottom: 2rem;
    }

    strong {
        font-weight: var(--medium);
    }

    em {
        font-weight: 400;
        font-style: italic;
    }

    h1 {
        font-size: 1.25rem;
        font-weight: var(--semiBold);
        margin: 0;
        margin-bottom: 2rem;
    }

    h2 {
        font-size: 1rem;
        font-weight: var(--semiBold);
        margin: 0;
        margin-bottom: 2rem;
    }

    h3,
    h4,
    h6 {
        font-size: 1rem;
        font-weight: var(--medium);
        margin: 0;
        margin-bottom: 2rem;
    }

    blockquote {
        border-left: 4px solid var(--greyDark2);
        padding-left: calc(1.5rem - 4px);
    }

    ul,
    ol,
    dl {
        padding: 0;
        margin-bottom: 2rem;
        margin-left: -1.5rem;
    }

    ul {
        list-style-type: none;

        li {
            position: relative;
            margin-left: 1.875rem;
            margin-left: 3rem;
        }

        li::before {
            content: '•';
            position: absolute;
            left: -1.5rem;
        }
    }

    ol {
        counter-reset: list-counter;
        list-style-type: none;

        li {
            position: relative;
            counter-increment: list-counter;
            margin-left: 3rem;
        }

        li::before {
            content: counter(list-counter, decimal) '.';
            width: 2rem;
            display: inline-block;
            text-align: right;
            position: absolute;
            left: -3rem;
        }
    }

    code {
        font-family: var(--mono);
        color: inherit;
        font-size: 14px;
        letter-spacing: 1px;
        line-height: 30px;
        background: #E7E7E7;
        padding: 0.2rem 0.2rem 0.2rem 0.4rem;
        border-radius: 1px;
        margin-left: 0.2rem;
        margin-right: 0.2rem;
    }

    pre {
        overflow: scroll;
        white-space: nowrap;
    }

    pre > code {
        margin: 0;
    }

    *:last-child {
        margin-bottom: 0;
    }

    @media (max-width: ${MD}px) {
        ul,
        ol,
        dl {
            margin-left: 0;
        }
    }
`

const MarkdownText = ({ text: textProp, className }: Props) => {
    const text = textProp || ''

    const markdownText = useMemo(() => (
        <ReactMarkdown
            source={text}
            escapeHtml
            allowedTypes={ALLOWED_MARKDOWN}
            unwrapDisallowed
        />
    ), [text])

    return (
        <Root className={className}>
            <MarkdownContainer>
                {markdownText}
            </MarkdownContainer>
        </Root>
    )
}

Object.assign(MarkdownText, {
    Container: MarkdownContainer,
})

export default MarkdownText
