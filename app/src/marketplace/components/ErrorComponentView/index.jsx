// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

import styles from './errorView.pcss'

const ErrorComponentView = () => (
    <div className={styles.errorView}>
        <Translate value="error.general" />
    </div>
)

export default ErrorComponentView
