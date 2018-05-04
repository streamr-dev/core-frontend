// @flow

import '../../styles/sass/bootstrap.scss'
import '@streamr/streamr-layout/css'
import '@streamr/streamr-layout/pcss'
import '../../styles/pcss'

import React from 'react'
import type { Node } from 'react'
import { Switch, withRouter } from 'react-router-dom'

import Head from '../Head'
import Nav from '../../containers/Nav'
import Footer from '../Footer'
import styles from '../Frame/Page/page.pcss'

type Props = {
    children: Node,
    location: {
        pathname: string,
    }
}

const topOfPage = document.getElementById('root')

class Page extends React.Component<Props> {
    componentDidUpdate(prevProps: Props) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.onRouteChanged()
        }
    }

    onRouteChanged = () => {
        if (topOfPage) {
            topOfPage.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }
    }

    render() {
        return (
            <div className={styles.page}>
                <div className={styles.pageInner}>
                    <Head />
                    <Nav opaque />
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

export default withRouter(Page)
