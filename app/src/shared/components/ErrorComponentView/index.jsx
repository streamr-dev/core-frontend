// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import cx from 'classnames'

import styles from './errorView.pcss'

type Props = {
    className?: string,
    style?: any,
}

const ErrorComponentView = ({ className, ...props }: Props) => (
    <div className={cx(className, styles.errorView)} {...props}>
        <Translate value="error.general" />
    </div>
)

export default ErrorComponentView
