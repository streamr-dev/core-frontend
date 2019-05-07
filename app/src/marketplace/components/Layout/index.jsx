// @flow

import '../../styles/pcss'

import React from 'react'

import Nav2 from '$shared/components/Nav2'
import Footer from '../../containers/Footer'
import styles from './layout.pcss'

type Props = {
    footer?: boolean,
}

const Layout = ({ footer = true, ...props }: Props = {}) => (
    <div className={styles.framed}>
        <div className={styles.inner}>
            <Nav2 />
            <div {...props} />
        </div>
        {!!footer && <Footer />}
    </div>
)

export default Layout
