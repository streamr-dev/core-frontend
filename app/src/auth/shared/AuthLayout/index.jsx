// @flow

import '$shared/assets/stylesheets'
import '$shared/assets/stylesheets/bootstrap.scss'

import * as React from 'react'
import Helmet from 'react-helmet'

import Footer from '../Footer'
import Logo from '../Logo'
import styles from './authLayout.pcss'

type Props = {
    children: React.Node,
}

const AuthLayout = ({ children }: Props) => (
    <React.Fragment>
        <Helmet
            htmlAttributes={{
                class: styles.html,
            }}
        />
        <div className={styles.root}>
            <div className={styles.outer}>
                <section className={styles.content}>
                    <div className={styles.inner}>
                        <Logo className={styles.logo} />
                        <div className={styles.panel}>
                            {children}
                        </div>
                    </div>
                </section>
                <Footer className={styles.footer} mobile />
            </div>
        </div>
    </React.Fragment>
)

export default AuthLayout
