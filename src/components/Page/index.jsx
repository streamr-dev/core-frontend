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

import Head from '../Head'
import Nav from '../../containers/Nav'
import Footer from '../Footer'

const { styles } = LayoutPage

type Props = {
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
        return (
            <div className={classNames(styles.page, styles.pageFramed)}>
                <Head />
                <div className={styles.pageInner}>
                    <Nav opaque overlay />
                    <Switch>
                        {this.props.children}
                    </Switch>
                </div>
                <Footer
                    currentLanguage="English"
                    languages={[{
                        name: 'English',
                        lang: 'en',
                    }]}
                />
            </div>
        )
    }
}

export default Page
