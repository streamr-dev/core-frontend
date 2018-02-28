// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './styles.pcss'

export default class RelatedProducts extends Component<{}, {}> {
    render() {
        return (
            <div className={classNames(styles.relatedProducts, 'product-page-section')}>
                <Container>
                    <h2>Related products</h2>
                </Container>
            </div>
        )
    }
}
