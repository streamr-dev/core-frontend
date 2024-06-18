import React from 'react'
import styled from 'styled-components'
import {
    Footer as UnstyledLayoutFooter,
    FooterColumn,
    FooterColumns as UnstyledFooterColumns,
    MadeBy as UnstyledMadeBy,
    SocialChannels,
} from '@streamr/streamr-layout'
import { COLORS } from '~/shared/utils/styled'
import { route } from '~/routes'

const MadeBy = styled(UnstyledMadeBy)`
    padding: 0 0 32px;
    text-align: center;

    @media (min-width: 1200px) {
        padding: 32px 0;
        text-align: left;
    }
`

const LayoutFooter = styled(UnstyledLayoutFooter)`
    background-color: ${COLORS.secondary};
`

const FooterColumns = styled(UnstyledFooterColumns)`
    border-top: ${({ separate = false }) => (separate ? '1px' : '0')} solid #d8d8d8;
`

const Footer = ({ topBorder = false }) => (
    <LayoutFooter>
        <FooterColumns separate={topBorder}>
            <FooterColumn title="Discover">
                <a href={route('root')}>Top</a>
                <a href={route('side.dataToken')}>DATA Token</a>
                <a href={route('site.dataUnions')}>Data Unions</a>
                <a href={route('site.marketplace')}>Marketplace</a>
                <a href={route('site.network')}>Network</a>
            </FooterColumn>
            <FooterColumn title="Project">
                <a href={route('site.about')}>About</a>
                <a href={route('site.roadmap')}>Roadmap</a>
                <a href={route('site.ecosystem')}>Ecosystem</a>
                <a href={route('site.papers')}>Papers</a>
                <a href={route('blog')}>Blog</a>
            </FooterColumn>
            <FooterColumn title="Developers">
                <a href={route('docs')}>Docs</a>
                <a href={route('site.fund')}>Data Fund</a>
                <a href={route('site.design')}>Design Assets</a>
            </FooterColumn>
            <FooterColumn title="Apps">
                <a href={route('networkExplorer')}>Network Explorer</a>
                <a href={route('hub')}>Hub</a>
            </FooterColumn>
            <FooterColumn title="Contact">
                <a href={route('contact.general')}>General</a>
                <a href={route('contact.media')}>Media</a>
                <a href={route('contact.jobs')}>Jobs</a>
                <a href={route('contact.labs')}>Business</a>
            </FooterColumn>
            <FooterColumn title="Legal">
                <a href={route('tos')}>Terms &amp; Conditions</a>
                <a href={route('privacyPolicy')}>Privacy</a>
            </FooterColumn>
        </FooterColumns>
        <SocialChannels />
        <MadeBy />
    </LayoutFooter>
)

export default Footer
