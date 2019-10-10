// @flow

import React from 'react'
import cx from 'classnames'

import InputControl from '$mp/components/InputControl'
import TextControl from '$shared/components/TextControl'
import InputError from '$mp/components/InputError'

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
                    immediateCommit={false}
                    commitEmpty
                    selectAllOnFocus
                    value={value}
                    onBlur={onFocusChange}
                    onFocus={onFocusChange}
                    className={cx(styles.input, {
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

export default TextField
