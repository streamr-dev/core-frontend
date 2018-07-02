// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './navDivider.pcss'

const NavDivider = () => <li className={classNames(styles.divider, 'hidden-md-up')} />

NavDivider.defaultProps = {
    raw: true,
}

export default NavDivider
