// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import Holder from '../../Holder'
import classNames from 'classnames'
import styles from './preview.pcss'
import pageStyles from '../productPage.pcss'

export default class Preview extends Component<{}> {
    render() {
        return (
            <div className={pageStyles.section}>
                <Container>
                    <div className={styles.preview}>
                        <div className={classNames(pageStyles.cell, pageStyles.headerCell)}>
                            Stream preview
                        </div>
                        <Holder width="100p" height="360" text="Boom!" />
                    </div>
                </Container>
            </div>
        )
    }
}
