// @flow

import * as React from 'react'

import styles from './buttonBookmark.pcss'

type Props = {
    children: React.Node,
}

const ButtonBookmark = ({ children }: Props) => (
    <div className={styles.root}>
        {children}
    </div>
)

export default ButtonBookmark
