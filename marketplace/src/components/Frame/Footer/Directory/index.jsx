// @flow

import React, { type Node } from 'react'
import { Container } from '@streamr/streamr-layout'
import styles from './directory.pcss'

type Props = {
    children: Node,
}

const Directory = ({ children }: Props) => (
    <div className={styles.directory}>
        <Container>
            <div className={styles.inner}>
                {children}
            </div>
        </Container>
    </div>
)

export default Directory
