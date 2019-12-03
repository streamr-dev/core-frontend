// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Footer as LayoutFooter, FooterColumn } from '@streamr/streamr-layout'

import links from '$shared/../links'

const Footer = () => (
    <LayoutFooter>
        <FooterColumn title="Learn">
            <a href="/">
                Top
            </a>
            <a href="/learn/network">
                Network
            </a>
            <a href="/learn/marketplace">
                Marketplace
            </a>
            <a href="/learn/core">
                Core
            </a>
        </FooterColumn>
        <FooterColumn title={I18n.t('general.company')}>
            <a href="/about">
                <Translate value="general.aboutUs" />
            </a>
            <a href="/design">
                Design Assets
            </a>
            <a href={links.blog}>
                <Translate value="general.blog" />
            </a>
        </FooterColumn>
        <FooterColumn title="Docs">
            <a href={links.docs.streams}>
                Streams
            </a>
            <a href={links.docs.canvases}>
                Canvases
            </a>
            <a href={links.docs.dashboards}>
                Dashboards
            </a>
            <a href={links.docs.products}>
                Products
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
    </LayoutFooter>
)

export default Footer
