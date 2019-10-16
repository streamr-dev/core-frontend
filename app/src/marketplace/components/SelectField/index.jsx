// @flow

import React from 'react'
import cx from 'classnames'

import InputControl from '$mp/components/InputControl'
import Select from '$shared/components/SelectInput/Select'
import InputError from '$mp/components/InputError'

import styles from './selectField.pcss'

export const SelectField = (props: any) => (
    <InputControl {...props}>
        {({
            value,
            hasFocus,
            onFocusChange,
            hasError,
            error,
            className,
            ...rest
        }) => (
            <div>
                <Select
                    value={value}
                    onBlur={onFocusChange}
                    onFocus={onFocusChange}
                    className={cx(styles.input, {
                        [styles.withFocus]: !!hasFocus,
                        [styles.withError]: !!hasError,
                    }, className)}
                    {...rest}
                />
                <InputError
                    eligible={hasError}
                    message={error}
                    preserved
                />
            </div>
        )}
    </InputControl>
)

export default SelectField
