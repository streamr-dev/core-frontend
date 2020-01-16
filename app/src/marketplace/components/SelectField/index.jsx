// @flow

import React from 'react'
import cx from 'classnames'

import Select, { type Props as SelectProps } from '$shared/components/SelectInput/Select'
import InputError from '$mp/components/InputError'
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
    const castProps: SelectProps = ((inputProps: any): SelectProps)

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
            <InputError
                eligible={hasError}
                message={lastError}
                preserved
            />
        </div>
    )
}

export default SelectField
