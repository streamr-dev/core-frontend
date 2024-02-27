import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface Props {
    image?: ReactNode
    children: ReactNode
    className?: string
    link?: ReactNode
    linkOnMobile?: boolean
}

export function EmptyState({ children, image, className, link, linkOnMobile }: Props) {
    return (
        <Root className={className}>
            {image && <ImageWrap>{image}</ImageWrap>}
            {children}
            {!!link && <LinkWrap $linkOnMobile={linkOnMobile}>{link}</LinkWrap>}
        </Root>
    )
}

const Root = styled.div`
    color: var(--greyDark);
    font-size: 16px;
    font-weight: var(--regular);
    padding: 6em 0;
    text-align: center;

    img {
        display: block;
        margin: 0 auto;
        max-width: 60%;
    }

    small {
        display: block;
        font-size: 12px;
        margin-top: 0.25em;
    }

    @media (min-width: 376px) {
        font-size: 16px;

        small {
            font-size: 12px;
        }
    }

    @media (min-width: 745px) {
        font-size: 20px;
        padding: 5em 0;

        a + a {
            margin-left: 32px;
        }

        small {
            font-size: 14px;
        }
    }

    @media (min-width: 1441px) {
        font-size: 24px;
        padding: 3.75em 0;

        small {
            font-size: 16px;
        }
    }
`

const ImageWrap = styled.div`
    margin-bottom: 32px;
`

const LinkWrap = styled.div<{ $linkOnMobile?: boolean }>`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1.25em;

    a + a {
        margin-left: 0;
        margin-top: 16px;
    }

    @media (min-width: 745px) {
        align-items: unset;
        flex-direction: row;
        margin-top: 1.5em;

        a + a {
            margin: 0 0 0 32px;
        }
    }
`
