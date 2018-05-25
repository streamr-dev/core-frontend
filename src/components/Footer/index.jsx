// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Footer as FrameFooter, FooterColumn } from '../Frame'
import links from '../../links'
import type { LanguageProps } from '../Frame/Footer'

const Footer = (props: LanguageProps) => (
    <FrameFooter {...props}>
        <FooterColumn title={I18n.t('footer.columnTitle.product')}>
            <a href={links.howItWorks}>
                <Translate value="links.howItWorks" />
            </a>
            <a href={links.streamrSystem}>
                <Translate value="links.streamrSystem" />
            </a>
            <a href={links.tryTheEditor} className="hidden-md-down">
                <Translate value="links.tryTheEditor" />
            </a>
        </FooterColumn>
        <FooterColumn title={I18n.t('footer.columnTitle.company')}>
            <a href={links.aboutUs}>
                <Translate value="links.aboutUs" />
            </a>
            <a href={links.faq}>
                <Translate value="links.faq" />
            </a>
            <a href={links.blog}>
                <Translate value="links.blog" />
            </a>
        </FooterColumn>
        <FooterColumn title={I18n.t('footer.columnTitle.contact')}>
            <a href={links.contact.general}>
                <Translate value="links.general" />
            </a>
            <a href={links.contact.media}>
                <Translate value="links.media" />
            </a>
            <a href={links.contact.jobs}>
                <Translate value="links.jobs" />
            </a>
            <a href={links.contact.labs}>
                <Translate value="links.labs" />
            </a>
        </FooterColumn>
        <FooterColumn title={I18n.t('footer.columnTitle.documents')}>
            <a href={I18n.t('urls.whitepaper')}>
                <Translate value="whitepaper" />
            </a>
            <a href={links.contributionSummary}>
                <Translate value="links.contributionSummary" />
            </a>
            <a href="https://s3.amazonaws.com/streamr-public/streamr-terms-of-use.pdf">
                <Translate value="links.terms" />
            </a>
            <a href="https://s3.amazonaws.com/streamr-public/streamr-privacy-policy.pdf">
                <Translate value="links.privacy" />
            </a>
        </FooterColumn>
    </FrameFooter>
)

export default Footer
