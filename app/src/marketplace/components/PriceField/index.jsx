// @flow

import React from 'react'
import cx from 'classnames'

import TextControl from '$shared/components/TextControl'
import InputError from '$mp/components/InputError'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'

import styles from './priceField.pcss'

type Props = LastErrorProps & {
    currency: string,
    className?: string,
    value?: string | number,
}

const PriceField = ({
    currency,
    className,
    value,
    isProcessing,
    error,
    ...inputProps
}: Props) => {
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })

    return (
        <div className={cx(styles.root, className)}>
            <div
                className={cx(styles.inputWrapper, {
                    [styles.withError]: !!hasError,
                })}
            >
                <TextControl
                    immediateCommit={false}
                    commitEmpty
                    selectAllOnFocus
                    value={value}
                    className={styles.input}
                    {...inputProps}
                />
                <span className={styles.currency}>{currency}</span>
            </div>
            <InputError
                eligible={hasError}
                message={lastError}
                preserved={false}
            />
        </div>
    )
}

export default PriceField
