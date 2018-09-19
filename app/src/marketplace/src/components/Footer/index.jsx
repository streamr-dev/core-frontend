// @flow

import React from 'react'
import { Translate, I18n, Footer as FrameFooter, FooterColumn, type LanguageProps } from '@streamr/streamr-layout'

import type { DispatchProps } from '../../containers/Footer'
import { formatPath } from '../../utils/url'
import links from '../../links'

type Props = LanguageProps & DispatchProps & {
    location: {
        pathname: string,
    },
}

class Footer extends React.Component<Props> {
    onSelectLanguage = (locale: string) => {
        const { pushLocation, location: { pathname } } = this.props

        pushLocation(formatPath(pathname, {
            locale,
        }))
    }

    render() {
        const { location, ...props } = this.props

        return (
            <FrameFooter
                {...props}
                localeUrlFormatter={(pathname: ?string, locale: string) => (
                    formatPath(pathname || '', {
                        locale,
                    })
                )}
                onSelectLanguage={this.onSelectLanguage}
            >
                <FooterColumn title={I18n.t('general.product')}>
                    <a href={links.howItWorks}>
                        <Translate value="general.howItWorks" />
                    </a>
                    <a href={links.streamrSystem}>
                        <Translate value="general.streamrSystem" />
                    </a>
                    <a href={links.tryTheEditor} className="hidden-md-down">
                        <Translate value="general.tryTheEditor" />
                    </a>
                </FooterColumn>
                <FooterColumn title={I18n.t('general.company')}>
                    <a href={links.aboutUs}>
                        <Translate value="general.aboutUs" />
                    </a>
                    <a href={links.faq}>
                        <Translate value="general.faq" />
                    </a>
                    <a href={links.blog}>
                        <Translate value="general.blog" />
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
            </FrameFooter>
        )
    }
}

export default Footer
