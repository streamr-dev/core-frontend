// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import { Footer as LayoutFooter, FooterColumn, FooterColumns, SocialChannels, MadeBy as UnstyledMadeBy } from '@streamr/streamr-layout'

import links from '$shared/../links'

const MadeBy = styled(UnstyledMadeBy)`
    padding: 0 0 32px;
    text-align: center;

    @media (min-width: 1200px) {
        padding: 32px 0;
        text-align: left;
    }
`

const Footer = () => (
    <LayoutFooter>
        <FooterColumns>
            <FooterColumn title={I18n.t('general.learn')}>
                <a href="/">
                    <Translate value="general.top" />
                </a>
                <a href="/learn/network">
                    <Translate value="general.network" />
                </a>
                <a href="/learn/marketplace">
                    <Translate value="general.marketplace" />
                </a>
                <a href="/learn/core">
                    <Translate value="general.core" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.apps')}>
                <a href={links.marketplace.main}>
                    <Translate value="general.marketplace" />
                </a>
                <a href={links.userpages.main}>
                    <Translate value="general.core" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.project')}>
                <a href="/about">
                    <Translate value="general.aboutUs" />
                </a>
                <a href="/design">
                    <Translate value="general.designAssets" />
                </a>
                <a href={links.blog}>
                    <Translate value="general.blog" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.docs')}>
                <a href={links.docs.streams}>
                    <Translate value="general.streams" />
                </a>
                <a href={links.docs.canvases}>
                    <Translate value="general.canvases" />
                </a>
                <a href={links.docs.dashboards}>
                    <Translate value="general.dashboards" />
                </a>
                <a href={links.docs.products}>
                    <Translate value="general.products" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.contact')}>
                <a href={links.contact.general}>
                    <Translate value="general.general" />
                </a>
                <a href={links.contact.media}>
                    <Translate value="general.media" />
                </a>
                <a href={links.contact.jobs}>
                    <Translate value="general.jobs" />
                </a>
                <a href={links.contact.labs}>
                    <Translate value="general.labs" />
                </a>
            </FooterColumn>
            <FooterColumn title={I18n.t('general.documents')}>
                <a href={I18n.t('urls.whitepaper')}>
                    <Translate value="general.whitepaper" />
                </a>
                <a href={links.contributionSummary}>
                    <Translate value="general.contributionSummary" />
                </a>
                <a href="https://s3.amazonaws.com/streamr-public/streamr-terms-of-use.pdf">
                    <Translate value="general.terms" />
                </a>
                <a href="https://s3.amazonaws.com/streamr-public/streamr-privacy-policy.pdf">
                    <Translate value="general.privacy" />
                </a>
            </FooterColumn>
        </FooterColumns>
        <SocialChannels />
        <MadeBy />
    </LayoutFooter>
)

export default Footer
