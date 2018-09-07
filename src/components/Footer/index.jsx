// @flow

import * as React from 'react'
import { I18n } from 'react-redux-i18n'
import handleViewport from 'react-in-viewport'
import cx from 'classnames'

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
    'rocket',
    'telegram',
    'reddit',
    'twitter',
    'linkedin',
    'youtube',
    'medium',
]

export type LanguageProps = {
    languages: Array<{
        name: string,
        lang: string,
    }>,
    currentLanguage: string,
}

type Props = LanguageProps & {
    children: React.Node,
    onSelectLanguage: (string) => void,
    inViewport?: boolean,
    innerRef?: any,
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
    inViewport,
    innerRef,
}: Props) => {
    const locales = languages.map((l) => l.lang)

    return (
        <div
            ref={innerRef}
            className={styles.root}
        >
            <div
                className={cx(styles.inner, {
                    [styles.inViewport]: !!inViewport,
                })}
            >
                <Directory>
                    <FooterColumn title={I18n.t('general.language')}>
                        <LanguageSelector selected={currentLanguage}>
                            {languages.map(({ lang, name }) => (
                                <LanguageLink
                                    key={lang}
                                    href={localize(pathname(), lang, locales)}
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
        </div>
    )
}

export default handleViewport(Footer)
