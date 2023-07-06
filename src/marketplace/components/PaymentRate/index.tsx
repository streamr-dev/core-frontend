import React, { useEffect, useState } from 'react'
import { contractCurrencies as currencies } from '~/shared/utils/constants'
import { formatPrice } from '~/marketplace/utils/price'
import { getTokenInformation } from '~/marketplace/utils/web3'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { TimeUnit } from '~/shared/utils/timeUnit'
import { BNish, toBN } from '~/utils/bn'

type Props = {
    amount: BNish
    pricingTokenAddress: string
    chainId: number
    timeUnit: TimeUnit
    className?: string
    tag?: 'div' | 'span'
}

const PaymentRate = (props: Props) => {
    const {
        amount,
        pricingTokenAddress,
        chainId,
        timeUnit,
        className,
        tag: Tag = 'div',
    } = props
    const [currency, setCurrency] = useState(currencies.PRODUCT_DEFINED)
    const [symbol, setSymbol] = useState(currencies.DATA)
    const [decimals, setDecimals] = useState(toBN(18))
    const isMounted = useIsMounted()
    useEffect(() => {
        const check = async () => {
            if (pricingTokenAddress != null) {
                const info = await getTokenInformation(pricingTokenAddress, chainId)

                if (isMounted() && info) {
                    setCurrency(currencies.PRODUCT_DEFINED)
                    setSymbol(info.symbol)
                    setDecimals(toBN(info.decimals))
                }
            }
        }

        check()
    }, [pricingTokenAddress, chainId, isMounted])
    return (
        <Tag className={className}>
            {formatPrice(toBN(amount), currency, decimals, timeUnit, symbol)}
        </Tag>
    )
}

export default PaymentRate
