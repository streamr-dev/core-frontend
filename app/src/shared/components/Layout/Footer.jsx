import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import { Footer as LayoutFooter, FooterColumn, FooterColumns, SocialChannels, MadeBy as UnstyledMadeBy } from '@streamr/streamr-layout'
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

const FooterWithBorder = styled(FooterColumns)`
    border-top: ${({ topBorder }) => (topBorder ? '1px' : '0')} solid #D8D8D8;
`

const Footer = ({ topBorder = false }) => (
    <LayoutFooter>
        <FooterWithBorder topBorder={topBorder}>
            <FooterColumn title={I18n.t('general.learn')}>
                <a href={routes.root()}>
                    <Translate value="general.top" />
                </a>
                <a href={routes.site.learn.network()}>
                    <Translate value="general.network" />
                </a>
                <a href={routes.site.learn.marketplace()}>
                    <Translate value="general.marketplace" />
                </a>
                <a href={routes.site.learn.core()}>
                    <Translate value="general.core" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.apps')}>
                <a href={routes.marketplace.index()}>
                    <Translate value="general.marketplace" />
                </a>
                <a href={routes.core()}>
                    <Translate value="general.core" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.project')}>
                <a href={routes.site.about()}>
                    <Translate value="general.aboutUs" />
                </a>
                <a href={routes.site.design()}>
                    <Translate value="general.designAssets" />
                </a>
                <a href={routes.community.medium()}>
                    <Translate value="general.blog" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.docs')}>
                <a href={docsLinks.streams}>
                    <Translate value="general.streams" />
                </a>
                <a href={docsLinks.canvases}>
                    <Translate value="general.canvases" />
                </a>
                <a href={docsLinks.dashboards}>
                    <Translate value="general.dashboards" />
                </a>
                <a href={docsLinks.products}>
                    <Translate value="general.products" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.contact')}>
                <a href={routes.contact.general()}>
                    <Translate value="general.general" />
                </a>
                <a href={routes.contact.media()}>
                    <Translate value="general.media" />
                </a>
                <a href={routes.contact.jobs()}>
                    <Translate value="general.jobs" />
                </a>
                <a href={routes.contact.labs()}>
                    <Translate value="general.labs" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.documents')}>
                <a href={I18n.t('urls.whitepaper')}>
                    <Translate value="general.whitepaper" />
                </a>
                <a href={routes.contributionSummary()}>
                    <Translate value="general.contributionSummary" />
                </a>
                <a href={routes.tos()}>
                    <Translate value="general.terms" />
                </a>
                <a href={routes.privacyPolicy()}>
                    <Translate value="general.privacy" />
                </a>
            </FooterColumn>
        </FooterWithBorder>
        <SocialChannels />
        <MadeBy />
    </LayoutFooter>
)

export default Footer
