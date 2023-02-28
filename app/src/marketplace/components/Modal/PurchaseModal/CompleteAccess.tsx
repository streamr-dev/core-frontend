import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import BN from 'bignumber.js'

import { TimeUnit } from '$shared/types/common-types'
import TokenLogo from '$shared/components/TokenLogo'
import { priceForTimeUnits } from '$mp/utils/price'
import { TheGraphPaymentDetails } from '$app/src/services/projects'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getUsdRate } from '$shared/utils/coingecko'
import { COLORS, MEDIUM } from '$shared/utils/styled'
import { Currency, DialogContainer, DialogTitle, NextButton, Price, Usd } from './styles'

type Props = {
    visible: boolean,
    projectName: string,
    paymentDetails: TheGraphPaymentDetails,
    length: string,
    timeUnit: TimeUnit,
    tokenSymbol: string,
    chainId: number,
    onPayClicked: () => void,
}

const Container = styled.div`
    display: grid;
    background: #FFFFFF;
    border-radius: 8px;
    gap: 16px;
    padding: 32px 24px;
`

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 36px;
`

const PriceDetails = styled.div`
    display: grid;
    gap: 8px;
`

const Property = styled.div`
    font-size: 16px;
    line-height: 12px;
`

const Value = styled.div`
    font-weight: ${MEDIUM};
    font-size: 16px;
    line-height: 12px;
    justify-self: end;
`

export const Box = styled.div`
    display: grid;
    grid-template-columns: 1fr 24px;
    background-color: ${COLORS.secondary};
    border-radius: 8px;
    padding: 24px;
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.05em;
`

const CompleteAccess = ({ visible,projectName, length, timeUnit, tokenSymbol, chainId, paymentDetails, onPayClicked }: Props) => {
    const isMounted = useIsMounted()
    const tokenAddress = useMemo(() => paymentDetails?.pricingTokenAddress, [paymentDetails])
    const pricePerSecond = useMemo(() => paymentDetails?.pricePerSecond, [paymentDetails])
    const price = useMemo(() => (
        (pricePerSecond && timeUnit) ? priceForTimeUnits(pricePerSecond, length, timeUnit) : new BN(0)
    ), [length,  pricePerSecond, timeUnit])
    const [usdPrice, setUsdPrice] = useState<BN>(new BN(0))

    useEffect(() => {
        const load = async () => {
            const rate = await getUsdRate(tokenAddress, chainId)

            if (isMounted()) {
                setUsdPrice(price.multipliedBy(rate))
            }
        }

        if (tokenAddress) {
            load()
        }
    }, [isMounted, price, tokenAddress, chainId])

    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <DialogTitle>Complete your access</DialogTitle>
            <Container>
                <DetailsGrid>
                    <Property>Project</Property>
                    <Value>{projectName}</Value>
                </DetailsGrid>
                <DetailsGrid>
                    <Property>Access period</Property>
                    <Value>{length} {timeUnit}</Value>
                </DetailsGrid>
                <Box>
                    <PriceDetails>
                        <Price>
                            {price.isFinite() ? price.toFixed(3) : '-'} <Currency>{tokenSymbol}</Currency>
                        </Price>
                        <Usd>
                            APPROX {usdPrice.isFinite() ? usdPrice.toFixed(2) : '-'} USD
                        </Usd>
                    </PriceDetails>
                    <TokenLogo
                        chainId={chainId}
                        contractAddress={tokenAddress}
                        symbol={tokenSymbol}
                    />
                </Box>
            </Container>
            <NextButton
                onClick={onPayClicked}
            >
                Pay now
            </NextButton>
        </DialogContainer>
    )
}

export default CompleteAccess
