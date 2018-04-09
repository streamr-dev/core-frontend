// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import styles from './createProductButton.pcss'

type Props = {
    className?: string,
    to: string
}

const CreateProductButton = ({ className, to }: Props) => (
    <Link
        to={to}
        className={classnames(className, styles.createProductButton)}
    >
        <span className={styles.icon}>+</span>
        <div className={styles.popup}>
            Create A Product
        </div>
    </Link>
)

export default CreateProductButton
