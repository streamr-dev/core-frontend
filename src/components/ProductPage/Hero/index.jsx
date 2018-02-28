// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './styles.pcss'

export default class Hero extends Component<{}, {}> {
    render() {
        return (
            <div className={classNames(styles.hero, 'product-page-section')}>
                <Container>
                    <h1>Hero</h1>
                </Container>
            </div>
        )
    }
}
