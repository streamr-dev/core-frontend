// @flow

import React from 'react'
import type { Node } from 'react'
import { Container } from '@streamr/streamr-layout'

import styles from './panel.pcss'

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
