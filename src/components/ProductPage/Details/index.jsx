// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './styles.pcss'

export default class Details extends Component<{}, {}> {
    render() {
        return (
            <div className={classNames(styles.details, 'product-page-section')}>
                <Container>
                    <h2>Details</h2>
                </Container>
            </div>
        )
    }
}
