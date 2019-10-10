// @flow

import React from 'react'
import cx from 'classnames'

import InputControl from '$mp/components/InputControl'
import TextControl from '$shared/components/TextControl'
import InputError from '$mp/components/InputError'

import styles from './priceField.pcss'

type Props = {
    currency: string,
}

const PriceField = ({ currency, ...props }: Props) => (
    <InputControl {...props}>
        {({
            value,
            onFocusChange,
            hasFocus,
            hasError,
            error,
            className,
            ...rest
        }) => (
            <div className={styles.root}>
                <div
                    className={cx(styles.inputWrapper, {
                        [styles.withFocus]: !!hasFocus,
                        [styles.withError]: !!hasError,
                    })}
                >
                    <TextControl
                        immediateCommit={false}
                        commitEmpty
                        selectAllOnFocus
                        value={value}
                        onBlur={onFocusChange}
                        onFocus={onFocusChange}
                        className={styles.input}
                        {...rest}
                    />
                    <span className={styles.currency}>{currency}</span>
                </div>
                <InputError
                    eligible={hasError}
                    message={error}
                    preserved
                />
            </div>
        )}
    </InputControl>
)

export default PriceField
