import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import BN from 'bignumber.js'

import { getConfigForChain } from '$shared/web3/config'
import NetworkIcon from '$shared/components/NetworkIcon'
import TokenLogo from '$shared/components/TokenLogo'
import Text from '$ui/Text'
import SelectField2 from '$mp/components/SelectField2'
import { TheGraphPaymentDetails, } from '$app/src/services/projects'
import { getCustomTokenBalance } from '$mp/utils/web3'
import useIsMounted from '$shared/hooks/useIsMounted'
import { priceForTimeUnits } from '$mp/utils/price'
import { useAuthController } from '$app/src/auth/hooks/useAuthController'
import { getUsdRate } from '$shared/utils/coingecko'
import { COLORS } from '$shared/utils/styled'
import {TimeUnit, timeUnits} from "$shared/utils/timeUnit"

import { fromDecimals } from '$mp/utils/math'
import { Currency, DetailsBox, DialogContainer, DialogTitle, NextButton, Price, Usd } from './styles'

const Outer = styled.div`
    gap: 12px;
    display: grid;
`

const PeriodContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #FFFFFF;
    border-radius: 8px;
    gap: 16px;
    padding: 32px 24px;
`

const DetailsContainer = styled.div`
    display: grid;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 24px;
    gap: 8px;
`

const Chain = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    background: ${COLORS.secondary};
    border-radius: 8px;
    padding: 18px 16px;
    gap: 8px;
    align-items: center;
`

const ChainIcon = styled(NetworkIcon)`
    width: 32px;
    height: 32px;
`

const ChainName = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
`

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 24px;
    background: ${COLORS.secondary};
    border-radius: 8px;
    padding: 18px 16px;
`

const Balance = styled.div`
    background: #FFFFFF;
    border-radius: 2px;
    display: inline-flex;
    padding: 4px 8px;
    margin-bottom: 12px;
`

const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((unit: TimeUnit) => ({
    label: `${unit.charAt(0).toUpperCase()}${unit.slice(1)}s`, // Uppercase first letter and pluralize
    value: unit,
}))

type Props = {
    visible: boolean,
    chainId: number,
    paymentDetails: TheGraphPaymentDetails,
    tokenSymbol: string,
    tokenDecimals: number,
    onPayClicked: (length: string, timeUnit: TimeUnit) => void,
}

const ChooseAccessPeriod = ({ visible, chainId, paymentDetails, tokenSymbol, tokenDecimals, onPayClicked }: Props) => {
    const isMounted = useIsMounted()
    const [length, setLength] = useState<string>("1")
    const [selectedUnit, setSelectedUnit] = useState(timeUnits.hour)
    const [myBalance, setMyBalance] = useState<BN>(new BN(0))
    const [usdPrice, setUsdPrice] = useState<BN>(new BN(0))
    const { currentAuthSession } = useAuthController()
    const authenticatedUserAddress = currentAuthSession.address

    const tokenAddress = useMemo(() => paymentDetails?.pricingTokenAddress, [paymentDetails])
    const pricePerSecond = useMemo(() => paymentDetails?.pricePerSecond, [paymentDetails])
    const price = useMemo(() => (
        fromDecimals(priceForTimeUnits(pricePerSecond, length, selectedUnit), new BN(tokenDecimals))
    ), [length,  pricePerSecond, selectedUnit, tokenDecimals])
    const chainName = useMemo(() => {
        if (chainId != null) {
            return getConfigForChain(chainId).name
        }
        return ''
    }, [chainId])

    useEffect(() => {
        const load = async () => {
            const balance = await getCustomTokenBalance(tokenAddress, authenticatedUserAddress, true, chainId)

            if (isMounted()) {
                setMyBalance(balance)
            }
        }

        if (tokenAddress && authenticatedUserAddress) {
            load()
        }
    }, [chainId, tokenAddress, isMounted, authenticatedUserAddress])

    useEffect(() => {
        const load = async () => {
            try {
                const rate = await getUsdRate(tokenAddress, chainId)
                if (isMounted()) {
                    setUsdPrice(price.multipliedBy(rate))
                }
            } catch (e) {
                console.error(e)
            }
        }

        if (tokenAddress && price.isFinite()) {
            load()
        }
    }, [isMounted, price, tokenAddress, chainId])

    if (!visible) {
        return null
    }

    return (
        <DialogContainer>
            <DialogTitle>Choose access period</DialogTitle>
            <Outer>
                <PeriodContainer>
                    <Text
                        value={length}
                        onCommit={(v) => setLength(v) }
                    />
                    <SelectField2
                        placeholder="Select a time unit"
                        options={options}
                        value={selectedUnit}
                        onChange={(v) => setSelectedUnit(v)}
                        isClearable={false}
                        fullWidth
                    />
                </PeriodContainer>
                <DetailsContainer>
                    <Chain>
                        <ChainIcon chainId={chainId} />
                        <ChainName>{chainName}</ChainName>
                    </Chain>
                    <DetailsGrid>
                        <DetailsBox>
                            <div>
                                <Balance>{myBalance.toFixed(3)}</Balance> BALANCE
                            </div>
                            <Price>
                                {price.isFinite() ? price.toFixed(3) : '-'} <Currency>{tokenSymbol}</Currency>
                            </Price>
                            <Usd>
                                APPROX {usdPrice.isFinite() ? usdPrice.toFixed(2) : '-'} USD
                            </Usd>
                        </DetailsBox>
                        <div>
                            <TokenLogo
                                chainId={chainId}
                                contractAddress={tokenAddress}
                                symbol={tokenSymbol}
                            />
                        </div>
                    </DetailsGrid>
                </DetailsContainer>
            </Outer>
            <NextButton
                onClick={() => onPayClicked(length, selectedUnit)}
                disabled={!price.isFinite()}
            >
                Pay now
            </NextButton>
        </DialogContainer>
    )
}

export default ChooseAccessPeriod
