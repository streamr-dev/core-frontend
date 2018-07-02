// @flow

import React from 'react'
import { Translate } from '@streamr/streamr-layout'

import styles from './errorView.pcss'

const ErrorComponentView = () => (
    <div className={styles.errorView}>
        <Translate value="error.general" />
    </div>
)

export default ErrorComponentView
