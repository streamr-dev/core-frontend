import React from 'react'
import cx from 'classnames'
import { Props as SelectProps } from '$ui/Select'
import Select from '$ui/Select'
import Errors from '$ui/Errors'
import { LastErrorProps } from '$shared/hooks/useLastError'
import { useLastError } from '$shared/hooks/useLastError'
import styles from './selectField.pcss'
type SelectFieldProps = LastErrorProps &
    SelectProps & {
        disabled?: boolean
        errorsTheme?: any
        className?: string
    }
export const SelectField = ({
    error,
    isProcessing,
    disabled,
    errorsTheme,
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
                controlClassName={cx({
                    [styles.withError]: !!hasError,
                })}
                disabled={disabled}
                {...castProps}
            />
            <Errors overlap theme={errorsTheme}>
                {!!hasError && lastError}
            </Errors>
        </div>
    )
}
export default SelectField
