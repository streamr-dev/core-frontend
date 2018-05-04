// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './navLabel.pcss'

type Props = {
    value: string,
}

const NavLabel = ({ value }: Props) => (
    <li className={classNames(styles.label, 'hidden-md-up')}>
        {value}
    </li>
)

NavLabel.defaultProps = {
    raw: true,
}

export default NavLabel
