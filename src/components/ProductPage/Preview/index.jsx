// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './styles.pcss'

export default class Preview extends Component<{}, {}> {
    render() {
        return (
            <div className={classNames(styles.preview, 'product-page-section')}>
                <Container>
                    <h2>Preview</h2>
                </Container>
            </div>
        )
    }
}
