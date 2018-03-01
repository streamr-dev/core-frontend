// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import Holder from '../../Holder'
import styles from './styles.pcss'

export default class Preview extends Component<{}, {}> {
    render() {
        return (
            <div className="product-page-section">
                <Container>
                    <div className={styles.preview}>
                        <div className="cell header-cell">
                            Stream preview
                        </div>
                        <Holder width="100p" height="360" text="Boom!" />
                    </div>
                </Container>
            </div>
        )
    }
}
