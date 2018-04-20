// @flow

import React from 'react'
import styles from './basic.pcss'

type Props = {
    title: string,
}

const Basic = ({ title }: Props) => (
    <div>
        <div className={styles.title}>{title}</div>
    </div>
)

export default Basic
