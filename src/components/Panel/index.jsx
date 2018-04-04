// @flow

import React from 'react'
import { Container } from '@streamr/streamr-layout'
import styles from './panel.pcss'
import type { Node } from 'react'

type Props = {
    children: Node,
}

const Panel = ({ children }: Props) => (
    <section className={styles.panel}>
        <Container>
            <div className={styles.flexcontainer}>
                {children}
            </div>
        </Container>
    </section>
)

export default Panel
