// @flow

import React from 'react'

import Nav from '../../containers/Nav'
import Footer from '../../containers/Footer'
import styles from './layout.pcss'

const Layout = (props: {}) => (
    <div className={styles.framed}>
        <div className={styles.inner}>
            <Nav opaque overlay />
            <div {...props} />
        </div>
        <Footer />
    </div>
)

export default Layout
