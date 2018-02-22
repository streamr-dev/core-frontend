// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import styles from './styles.pcss'

export default class Home extends Component<{}, {}> {
    render() {
        return (
            <div className={styles.home}>
                <Container>
                    <h1>Home.</h1>
                </Container>
            </div>
        )
    }
}
