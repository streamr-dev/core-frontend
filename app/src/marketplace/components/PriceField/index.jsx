// @flow

import React, { useState, useEffect, useCallback } from 'react'
import cx from 'classnames'

import Text from '$ui/Text'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'
import { getTokenInformation } from '$mp/utils/web3'

import styles from './priceField.pcss'

type Props = LastErrorProps & {
    pricingTokenAddress: string,
    className?: string,
    value?: string | number,
    onChange?: ?(SyntheticInputEvent<EventTarget>) => void,
}

const PriceField = ({
    pricingTokenAddress,
    className,
    value: valueProp,
    onChange: onChangeProp,
    isProcessing,
    error,
    ...inputProps
}: Props) => {
    const [symbol, setSymbol] = useState('DATA')
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })

    useEffect(() => {
        const load = async () => {
            const info = await getTokenInformation(pricingTokenAddress)
            if (info) {
                setSymbol(info.symbol)
            }
        }
        load()
    }, [pricingTokenAddress])

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
                <div>
                    <span className={styles.currency}>{symbol}</span>
                </div>
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
