// @flow

import React from 'react'
import type { Node } from 'react'
import { Container } from 'reactstrap'
import classNames from 'classnames'

import styles from './panel.pcss'

type Props = {
    children: Node,
    className?: string,
}

const Panel = ({ className, children }: Props) => (
    <section className={classNames(className, styles.panel)}>
        <Container>
            <div className={styles.flexcontainer}>
                {children}
            </div>
        </Container>
    </section>
)

export default Panel
