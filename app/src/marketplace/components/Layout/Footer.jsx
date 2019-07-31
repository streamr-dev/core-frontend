// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import FrameFooter, { FooterColumn } from '$shared/components/Footer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'

import withI18n, { type I18nProps } from '$mp/containers/WithI18n'
import { formatPath } from '$shared/utils/url'
import routes from '$routes'
import links from '../../../links'

export type DispatchProps = {
    pushLocation: (string) => void,
}

type Props = I18nProps & DispatchProps & {
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
        const { language, translations } = this.props
        const languages = Object.keys(translations).map((lang) => ({
            name: typeof translations[lang] === 'object' ? translations[lang].language.name : '',
            lang,
        }))

        return (
            <FrameFooter
                currentLanguage={language}
                languages={languages}
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
                    <a href={routes.canvasEditor()} className="d-none d-lg-inline">
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

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    pushLocation: (location: string) => (
        dispatch(push(location))
    ),
})

export default connect(null, mapDispatchToProps)(withRouter(withI18n(Footer)))
