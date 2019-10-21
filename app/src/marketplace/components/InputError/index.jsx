// @flow

import React from 'react'
import cx from 'classnames'

import SharedInputError from '$shared/components/FormControl/InputError'

import styles from './inputError.pcss'

export const InputError = ({ className, ...props }: any) => (
    <SharedInputError
        {...props}
        className={cx(styles.errorMessage, className)}
    />
)

export default InputError
