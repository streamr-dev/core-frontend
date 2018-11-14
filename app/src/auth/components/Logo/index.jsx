// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import logo from '../../assets/streamr-logo.svg'
import routes from '$routes'
import styles from './logo.pcss'

type Props = {
    className?: string,
}

const Logo = ({ className }: Props) => (
    <div className={cx(className, styles.root)}>
        <Link to={routes.root()} className={styles.link}>
            <img src={logo} alt="Streamr logo" />
        </Link>
    </div>
)

export default Logo
