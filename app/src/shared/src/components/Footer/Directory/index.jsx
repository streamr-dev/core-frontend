// @flow

import * as React from 'react'
import { Container } from 'reactstrap'
import styles from './directory.pcss'

type Props = {
    children: React.Node,
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
