// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import Logo from '../../Logo'
import links from '$shared/../links'
import styles from './navLogo.pcss'

const NavLogo = () => React.cloneElement(NavLogo.Link, {
    className: cx(NavLogo.Link.props.className, styles.logoLink),
    children: (
        <Logo
            className={styles.logo}
            color="#ff5c00"
        />
    ),
})

NavLogo.Link = (
    <Link to={links.marketplace.main}>
        {/* placeholder */}
    </Link>
)

export default NavLogo
