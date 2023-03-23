import React, { useState, useEffect, useCallback, ChangeEvent } from 'react'
import cx from 'classnames'
import Text, { TextInputProps } from '$ui/Text'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import { LastErrorProps } from '$shared/hooks/useLastError'
import { useLastError } from '$shared/hooks/useLastError'
import { getTokenInformation } from '$mp/utils/web3'
import styles from './priceField.pcss'
type Props = LastErrorProps & Partial<TextInputProps> & {
    pricingTokenAddress: string
    className?: string
    value?: string | number
    onChange?: ((arg0: React.SyntheticEvent<EventTarget>) => void) | null | undefined
    chainId: number
}

const PriceField = ({
    pricingTokenAddress,
    className,
    value: valueProp,
    onChange: onChangeProp,
    isProcessing,
    error,
    chainId,
    ...inputProps
}: Props) => {
    const [symbol, setSymbol] = useState('DATA')
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })
    useEffect(() => {
        const load = async () => {
            const info = await getTokenInformation(pricingTokenAddress, chainId)

            if (info) {
                setSymbol(info.symbol)
            }
        }

        load()
    }, [pricingTokenAddress, chainId])
    const [value, setValue] = useState(valueProp)
    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value)

            if (onChangeProp) {
                onChangeProp(e)
            }
        },
        [onChangeProp],
    )
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
