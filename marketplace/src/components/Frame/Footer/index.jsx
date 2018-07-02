// @flow

import React, { type Node } from 'react'
import { I18n } from 'react-redux-i18n'
import Copyright from './Copyright'
import Badge from './Badge'
import Badges from './Badges'
import Directory from './Directory'
import FooterColumn from './FooterColumn'
import styles from './footer.pcss'
import Wedge from './Wedge'
import LanguageSelector from './LanguageSelector'

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
    children: ?Node,
}

const Footer = ({ children, languages, currentLanguage }: Props) => (
    <div className={styles.footer}>
        <div className={styles.footerInner}>
            <Directory>
                <FooterColumn title={I18n.t('footer.columnTitle.language')}>
                    <LanguageSelector selected={currentLanguage}>
                        {languages.map((lang) => (
                            <a key={lang.lang}>
                                {lang.name}
                            </a>
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
