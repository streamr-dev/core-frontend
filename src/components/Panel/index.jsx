// @flow

import React, {Component} from 'react'
import { Container } from '@streamr/streamr-layout'
import styles from './panel.pcss'
import type { Node } from 'react'

type Props = {
    children: Node,
}

export default class Panel extends Component<Props> {
    render() {
        return (
            <section className={styles.panel}>
                <Container>
                    <div className={styles.flexcontainer}>
                        {this.props.children}
                    </div>
                </Container>
            </section>
        )
    }
}
