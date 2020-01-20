// @flow

import React from 'react'
import cx from 'classnames'

import Select, { type Props as SelectProps } from '$shared/components/SelectInput/Select'
import FormControlErrors from '$shared/components/FormControlErrors'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'

import styles from './selectField.pcss'

type SelectFieldProps = LastErrorProps & SelectProps & {
    disabled?: boolean,
}

export const SelectField = ({
    error,
    isProcessing,
    disabled,
    className,
    ...inputProps
}: SelectFieldProps) => {
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })
    const castProps: any = inputProps

    return (
        <div>
            <Select
                className={className}
                controlClassName={cx({
                    [styles.withError]: !!hasError,
                })}
                isDisabled={disabled}
                {...castProps}
            />
            <FormControlErrors>
                {!!hasError && lastError}
            </FormControlErrors>
        </div>
    )
}

export default SelectField
