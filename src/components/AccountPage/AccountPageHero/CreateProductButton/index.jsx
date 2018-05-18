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
        <div className={styles.circle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className={styles.icon}>
                <path fill="#fff" fillRule="evenodd" d="M11 9h9v2h-9v9H9v-9H0V9h9V0h2z" />
            </svg>
        </div>
        <div className={styles.popup}>
            Create A Product
        </div>
    </Link>
)

export default CreateProductButton
