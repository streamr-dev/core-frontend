// @flow

import React from 'react'
import cx from 'classnames'

import TextControl from '$shared/components/TextControl'
import InputError from '$mp/components/InputError'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'

import styles from './textField.pcss'

type TextFieldProps = LastErrorProps & {
    className?: string,
}

export const TextField = ({ error, isProcessing, className, ...inputProps }: TextFieldProps) => {
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })

    return (
        <div>
            <TextControl
                immediateCommit={false}
                commitEmpty
                selectAllOnFocus
                className={cx(styles.input, {
                    [styles.withError]: !!hasError,
                }, className)}
                {...inputProps}
            />
            <InputError
                eligible={hasError}
                message={lastError}
                preserved
            />
        </div>
    )
}

export default TextField
