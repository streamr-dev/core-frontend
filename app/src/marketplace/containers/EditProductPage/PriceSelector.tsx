import React, { useCallback, useContext, useEffect, useRef } from 'react'
import cx from 'classnames'
import { usePending } from '$shared/hooks/usePending'
import SetPrice from '$mp/components/SetPrice'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { getChainIdFromApiString } from '$shared/utils/chains'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
import styles from './PriceSelector.pcss'
type Props = {
    disabled?: boolean
}

const PriceSelector = ({ disabled }: Props) => {
    const isMounted = useRef(false)
    const { state: product } = useEditableState()
    const { publishAttempted } = useContext(EditControllerContext)
    const { updatePrice } = useEditableProductActions()
    const { isPending: contractProductLoadPending } = usePending('contractProduct.LOAD')
    const isDisabled = !!(disabled || contractProductLoadPending)
    const chainId = product && getChainIdFromApiString(product.chain)
    const { pricingTokenDecimals } = product
    const onPriceChange = useCallback(
        p => {
            updatePrice(p, product.priceCurrency, product.timeUnit, pricingTokenDecimals)
        },
        [updatePrice, product.priceCurrency, product.timeUnit, pricingTokenDecimals],
    )
    const onTimeUnitChange = useCallback(
        t => {
            updatePrice(product.price, product.priceCurrency, t, pricingTokenDecimals)
        },
        [updatePrice, product.price, product.priceCurrency, pricingTokenDecimals],
    )
    useEffect(() => {
        // Make sure we don't call updatePrice on component mount to not mess
        // with touched status of price
        if (isMounted.current) {
            updatePrice(product.price, product.priceCurrency, product.timeUnit, pricingTokenDecimals)
        } else {
            isMounted.current = true
        } // We don't want to duplicate changes above callbacks already do
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pricingTokenDecimals, updatePrice])
    const isFreeProduct = !!product.isFree
    const { isValid, message } = useValidation('pricePerSecond')
    return (
        <section id="price" className={cx(styles.root, styles.PriceSelector)}>
            <div>
                <h1>Set a price</h1>
                <p>
                    Set the price for your product. The price is defined per time unit in your selected payment token.
                    Buyers can purchase access for a time period of their choosing.
                </p>
                <div
                    className={cx(styles.inner, {
                        [styles.disabled]: isFreeProduct || isDisabled,
                    })}
                >
                    <SetPrice
                        className={styles.priceSelector}
                        disabled={isFreeProduct || isDisabled}
                        price={product.price}
                        onPriceChange={onPriceChange}
                        pricingTokenAddress={product.pricingTokenAddress}
                        timeUnit={product.timeUnit}
                        onTimeUnitChange={onTimeUnitChange}
                        error={publishAttempted && !isValid ? message : undefined}
                        chainId={chainId}
                    />
                </div>
            </div>
        </section>
    )
}

export default PriceSelector
