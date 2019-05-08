// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './navLabel.pcss'

type Props = {
    value: string,
}

const NavLabel = ({ value }: Props) => (
    <li className={classNames(styles.label, 'd-md-none')}>
        {value}
    </li>
)

export default NavLabel
