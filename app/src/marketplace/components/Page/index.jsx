// @flow

import '../../styles/sass/bootstrap.scss'
import '@streamr/streamr-layout/css'
import '@streamr/streamr-layout/pcss'
import '../../styles/pcss'

import React from 'react'
import type { Node } from 'react'
import { Switch } from 'react-router-dom'
import classNames from 'classnames'
import { Page as LayoutPage } from '@streamr/streamr-layout'

import type { I18nProps } from '../../containers/WithI18n'
import Nav from '../../containers/Nav'
import Footer from '../../containers/Footer'

const { styles } = LayoutPage

type Props = I18nProps & {
    children: Node,
    location: {
        pathname: string,
    },
    modalOpen: boolean,
    hideModal: () => void,
}

const topOfPage = document.getElementById('root')

class Page extends React.Component<Props> {
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
        const { language, translations } = this.props

        return (
            <div className={classNames(styles.page, styles.pageFramed)}>
                <div className={styles.pageInner}>
                    <Nav opaque overlay />
                    <Switch>
                        {this.props.children}
                    </Switch>
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

export default Page
