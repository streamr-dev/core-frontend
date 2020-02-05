// @flow

import React, { useState, useEffect, useCallback } from 'react'
import cx from 'classnames'

import Text from '$ui/Text'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'

import styles from './priceField.pcss'

type Props = LastErrorProps & {
    currency: string,
    className?: string,
    value?: string | number,
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
}

const PriceField = ({
    currency,
    className,
    value: valueProp,
    onChange: onChangeProp,
    isProcessing,
    error,
    ...inputProps
}: Props) => {
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })

    const [value, setValue] = useState(valueProp)

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    const onChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setValue(e.target.value)

        if (onChangeProp) {
            onChangeProp(e)
        }
    }, [onChangeProp])

    return (
        <div className={cx(styles.root, className)}>
            <div
                className={cx(styles.inputWrapper, {
                    [styles.withError]: !!hasError,
                })}
            >
                <Text
                    unstyled
                    smartCommit
                    selectAllOnFocus
                    value={value}
                    onChange={onChange}
                    className={styles.input}
                    {...inputProps}
                />
                <span className={styles.currency}>{currency}</span>
            </div>
            {hasError && !!lastError && (
                <Errors overlap theme={MarketplaceTheme}>
                    {lastError}
                </Errors>
            )}
        </div>
    )
}

export default PriceField
