// @flow

import React from 'react'
import cx from 'classnames'

import { Text } from '$shared/components/Input'
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
            <Text
                smartCommit
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
