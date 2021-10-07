import React from 'react'
import styled from 'styled-components'
import {
    Footer as LayoutFooter,
    FooterColumn,
    FooterColumns as UnstyledFooterColumns,
    MadeBy as UnstyledMadeBy,
    SocialChannels,
} from '@streamr/streamr-layout'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'

const MadeBy = styled(UnstyledMadeBy)`
    padding: 0 0 32px;
    text-align: center;

    @media (min-width: 1200px) {
        padding: 32px 0;
        text-align: left;
    }
`

const FooterColumns = styled(UnstyledFooterColumns)`
    border-top: ${({ separate }) => (separate ? '1px' : '0')} solid #d8d8d8;
`

const Footer = ({ topBorder = false }) => (
    <LayoutFooter>
        <FooterColumns separate={topBorder}>
            <FooterColumn title="Learn">
                <a href={routes.root()}>
                    Top
                </a>
                <a href={routes.site.discover.network()}>
                    Network
                </a>
                <a href={routes.site.discover.marketplace()}>
                    Marketplace
                </a>
                <a href={routes.site.discover.dataToken()}>
                    DATA Token
                </a>
            </FooterColumn>
            <FooterColumn title="Apps">
                <a href={routes.marketplace.index()}>
                    Marketplace
                </a>
                <a href={routes.core()}>
                    Core
                </a>
            </FooterColumn>
            <FooterColumn title="Project">
                <a href={routes.site.about()}>
                    About
                </a>
                <a href={routes.site.design()}>
                    Design Assets
                </a>
                <a href={routes.community.medium()}>
                    Blog
                </a>
            </FooterColumn>
            <FooterColumn title="Docs">
                <a href={docsLinks.streams}>
                    Streams
                </a>
                <a href={docsLinks.products}>
                    Products
                </a>
            </FooterColumn>
            <FooterColumn title="Contact">
                <a href={routes.contact.general()}>
                    General
                </a>
                <a href={routes.contact.media()}>
                    Media
                </a>
                <a href={routes.contact.jobs()}>
                    Jobs
                </a>
                <a href={routes.contact.labs()}>
                    Business
                </a>
            </FooterColumn>
            <FooterColumn title="Documents">
                <a href="https://streamr.network/whitepaper">
                    Whitepaper
                </a>
                <a href={routes.contributionSummary()}>
                    Contribution Summary
                </a>
                <a href={routes.tos()}>
                    Terms &amp; Conditions
                </a>
                <a href={routes.privacyPolicy()}>
                    Privacy
                </a>
            </FooterColumn>
        </FooterColumns>
        <SocialChannels />
        <MadeBy />
    </LayoutFooter>
)

export default Footer
