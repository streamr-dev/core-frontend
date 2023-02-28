import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import BN from 'bignumber.js'

import { getConfigForChain } from '$shared/web3/config'
import NetworkIcon from '$shared/components/NetworkIcon'
import { timeUnits } from '$shared/utils/constants'
import { TimeUnit } from '$shared/types/common-types'
import TokenLogo from '$shared/components/TokenLogo'
import Text from '$ui/Text'
import SelectField2 from '$mp/components/SelectField2'
import { TheGraphPaymentDetails, } from '$app/src/services/projects'
import { getCustomTokenBalance, getTokenInformation } from '$mp/utils/web3'
import useIsMounted from '$shared/hooks/useIsMounted'
import { priceForTimeUnits } from '$mp/utils/price'
import { useAuthController } from '$app/src/auth/hooks/useAuthController'
import { getUsdRate } from '$shared/utils/coingecko'
import { COLORS } from '$shared/utils/styled'

import { Currency, DetailsBox, DialogContainer, DialogTitle, NextButton, Price, Usd } from './styles'

type Props = {
    visible: boolean,
    chainId: number,
    paymentDetails: TheGraphPaymentDetails,
    onNextClicked: (length: string, timeUnit: TimeUnit, tokenSymbol: string) => void,
}

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

const ChooseAccessPeriod = ({ visible, chainId, paymentDetails, onNextClicked }: Props) => {
    const isMounted = useIsMounted()
    const [length, setLength] = useState<string>("1")
    const [selectedUnit, setSelectedUnit] = useState(timeUnits.hour)
    const [myBalance, setMyBalance] = useState<BN>(new BN(0))
    const [usdPrice, setUsdPrice] = useState<BN>(new BN(0))
    const [tokenSymbol, setTokenSymbol] = useState<string>(null)
    const { currentAuthSession } = useAuthController()
    const authenticatedUserAddress = currentAuthSession.address

    const tokenAddress = useMemo(() => paymentDetails?.pricingTokenAddress, [paymentDetails])
    const pricePerSecond = useMemo(() => paymentDetails?.pricePerSecond, [paymentDetails])
    const price = useMemo(() => priceForTimeUnits(pricePerSecond, length, selectedUnit), [length,  pricePerSecond, selectedUnit])

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
            const tokenInfo = await getTokenInformation(tokenAddress, chainId)
            const rate = await getUsdRate(tokenAddress, chainId)

            if (isMounted()) {
                setUsdPrice(price.multipliedBy(rate))
                setTokenSymbol(tokenInfo.symbol)
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
                        <ChainName>{getConfigForChain(chainId).name}</ChainName>
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
                onClick={() => onNextClicked(length, selectedUnit, tokenSymbol)}
            >
                Next
            </NextButton>
        </DialogContainer>
    )
}

export default ChooseAccessPeriod
