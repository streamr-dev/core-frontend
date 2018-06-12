// @flow

import * as React from 'react'
import { I18n } from 'react-redux-i18n'
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
}

const Footer = ({ children, languages, currentLanguage, onSelectLanguage }: Props) => (
    <div className={styles.footer}>
        <div className={styles.footerInner}>
            <Directory>
                <FooterColumn title={I18n.t('footer.columnTitle.language')}>
                    <LanguageSelector selected={currentLanguage}>
                        {languages.map(({ lang, name }) => (
                            <LanguageLink
                                key={lang}
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

export default Footer
