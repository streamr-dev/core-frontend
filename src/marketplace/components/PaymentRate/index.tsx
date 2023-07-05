import React, { useEffect, useState } from 'react'
import BN from 'bignumber.js'
import { contractCurrencies as currencies } from '~/shared/utils/constants'
import { formatPrice } from '~/marketplace/utils/price'
import { getTokenInformation } from '~/marketplace/utils/web3'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { TimeUnit } from '~/shared/utils/timeUnit'

type Props = {
    amount: BN
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
    const [decimals, setDecimals] = useState(new BN(18))
    const isMounted = useIsMounted()
    useEffect(() => {
        const check = async () => {
            if (pricingTokenAddress != null) {
                const info = await getTokenInformation(pricingTokenAddress, chainId)

                if (isMounted() && info) {
                    setCurrency(currencies.PRODUCT_DEFINED)
                    setSymbol(info.symbol)
                    setDecimals(new BN(info.decimals))
                }
            }
        }

        check()
    }, [pricingTokenAddress, chainId, isMounted])
    return (
        <Tag className={className}>
            {formatPrice(amount, currency, decimals, timeUnit, symbol)}
        </Tag>
    )
}

export default PaymentRate
