// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './navDivider.pcss'

const NavDivider = () => <li className={classNames(styles.divider, 'd-md-none')} />

NavDivider.defaultProps = {
    raw: true,
}

export default NavDivider
