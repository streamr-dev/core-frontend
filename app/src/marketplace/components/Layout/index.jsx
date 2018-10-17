// @flow

import React from 'react'
import type { Node } from 'react'

import type { I18nProps } from '../../containers/WithI18n'
import Nav from '../../containers/Nav'
import Footer from '../../containers/Footer'
import styles from './layout.pcss'

type Props = I18nProps & {
    children: Node,
    location: {
        pathname: string,
    },
    modalOpen: boolean,
    hideModal: () => void,
    className?: string,
}

const topOfPage = document.getElementById('root')

class Layout extends React.Component<Props> {
    componentDidUpdate(prevProps: Props) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.onRouteChanged()
        }
    }

    onRouteChanged = () => {
        if (topOfPage && !this.props.modalOpen) {
            topOfPage.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
        if (this.props.modalOpen) {
            this.props.hideModal()
        }
    }

    render() {
        const { language, translations, children, className } = this.props

        return (
            <div className={styles.framed}>
                <div className={styles.inner}>
                    <Nav opaque overlay />
                    <div className={className}>
                        {children}
                    </div>
                </div>
                <Footer
                    currentLanguage={language}
                    languages={Object.keys(translations).map((lang) => ({
                        name: typeof translations[lang] === 'object' && translations[lang].language.name,
                        lang,
                    }))}
                />
            </div>
        )
    }
}

export default Layout
