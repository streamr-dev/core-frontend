// @flow

import React from 'react'
import cx from 'classnames'

import InputControl from '$mp/components/ProductPage/InputControl'
import TextControl from '$shared/components/TextControl'

import styles from './textField.pcss'

export const TextField = (props: any) => (
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
                <TextControl
                    value={value}
                    onBlur={onFocusChange}
                    onFocus={onFocusChange}
                    className={cx(styles.input, {
                        [styles.withError]: !!hasError,
                    }, className)}
                    {...rest}
                />
                {!!hasError && (
                    <div className={styles.errorMessage}>{error}</div>
                )}
            </div>
        )}
    </InputControl>
)

export default TextField
