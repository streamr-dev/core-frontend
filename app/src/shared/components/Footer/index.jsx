// @flow

import * as React from 'react'
import { I18n } from 'react-redux-i18n'

import { localize } from '../../utils/locale'
import Copyright from './Copyright'
import Badge from './Badge'
import Badges from './Badges'
import Directory from './Directory'
import FooterColumn from './FooterColumn'
import styles from './footer.pcss'
import Wedge from './Wedge'
import LanguageSelector from './LanguageSelector'
import LanguageLink from './LanguageLink'

const badges = [
    'trello',
    'github',
    'telegram',
    'reddit',
    'twitter',
    'linkedin',
    'youtube',
    'medium',
]

type Language = {
    name: string,
    lang: string,
}

type Props = {
    children: React.Node,
    onSelectLanguage: (string) => void,
    currentLanguage: string,
    languages: Array<Language>,
    localeUrlFormatter: (?string, string, Array<string>) => string,
}

const pathname = () => {
    if (typeof window !== 'undefined') {
        return window.location.pathname
    }
    return null
}

const Footer = ({
    children,
    languages,
    currentLanguage,
    onSelectLanguage,
    localeUrlFormatter,
}: Props) => {
    const locales = languages.map((l) => l.lang)

    return (
        <div className={styles.root}>
            <Directory>
                <FooterColumn title={I18n.t('general.language')}>
                    <LanguageSelector selected={currentLanguage}>
                        {languages.map(({ lang, name }) => (
                            <LanguageLink
                                key={lang}
                                href={localeUrlFormatter(pathname(), lang, locales)}
                                value={lang}
                                onClick={onSelectLanguage}
                            >
                                {name}
                            </LanguageLink>
                        ))}
                    </LanguageSelector>
                </FooterColumn>
                <Wedge />
                {children}
            </Directory>
            <Badges perRow={4}>
                {badges.map((badge) => (
                    <Badge key={badge} id={badge} />
                ))}
            </Badges>
            <Copyright />
        </div>
    )
}

Footer.defaultProps = {
    localeUrlFormatter: localize,
}

export { default as FooterColumn } from './FooterColumn'

export default Footer
