// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import styles from './errorView.pcss'

const ErrorComponentView = () => (
    <div className={styles.errorView}>
        <Translate value="error.general" />
    </div>
)

export default ErrorComponentView
