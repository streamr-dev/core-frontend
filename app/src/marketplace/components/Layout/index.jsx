// @flow

import React from 'react'

import Nav from '../../containers/Nav'
import Footer from '../../containers/Footer'
import styles from './layout.pcss'

type Props = {
    footer?: boolean,
}

const Layout = ({ footer = true, ...props }: Props = {}) => (
    <div className={styles.framed}>
        <div className={styles.inner}>
            <Nav opaque overlay />
            <div {...props} />
        </div>
        {!!footer && <Footer />}
    </div>
)

export default Layout
