import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { DESKTOP, TABLET } from '~/shared/utils/styled'

export const LivePreviewWarning = () => {
    const { pathname } = useLocation()

    // Show warning only for /live-data page
    if (!pathname.includes('/live-data')) {
        return null
    }

    const brubeckUrl = 'https://brubeck.streamr.network' + pathname

    return (
        <Root>
            <SvgIcon name="infoBadge" />
            <div>
                Heads up! If your live data isn&apos;t displaying properly, try the{' '}
                <a href={brubeckUrl} rel="noopener noreferrer" target="_blank">
                    Brubeck Network Live Preview
                </a>
                . You may be required to sign in if you&apos;re viewing a private live
                stream.
            </div>
        </Root>
    )
}

const Root = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
    padding: 12px 72px 12px 40px;
    align-items: center;
    justify-content: left;
    color: white;
    background: #323232;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;

    padding: 12px 72px 12px 24px;

    @media (${TABLET}) {
        padding: 12px 72px 12px 24px;
    }

    @media (${DESKTOP}) {
        padding: 12px 72px 12px 40px;
    }

    // Make it stick to top
    position: sticky;
    top: 0px;
    z-index: 1000;

    & > svg {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        & circle {
            fill: #525252;
        }
    }

    & a {
        text-decoration: underline !important;
        cursor: pointer;
        color: inherit;
    }
`
