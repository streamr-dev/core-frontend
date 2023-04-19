import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import PaymentRate from '$mp/components/PaymentRate'
import { formatChainName } from '$shared/utils/chains'
import Button from '$shared/components/Button'
import ProjectPng from '$shared/assets/images/project.png'
import { MEDIUM } from '$shared/utils/styled'
import { getConfigForChain } from '$shared/web3/config'
import PurchaseModal from '$mp/components/Modal/PurchaseModal'
import { timeUnits } from '$shared/utils/timeUnit'
import { ProjectType, SalePoint } from '$shared/types'
import { getProjectTypeName } from '$app/src/getters'

interface Props {
    projectType: ProjectType
    projectName: string
    salePoints: SalePoint[]
}

const GetAccessContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 488px;
    margin: 0 auto;
    padding: 15px 0 100px;

    img {
        display: block;
    }

    h1 {
        font-weight: ${MEDIUM};
        font-size: 34px;
        line-height: 44px;
        margin-bottom: 19px;
        text-align: center;
    }

    p {
        font-size: 18px;
        line-height: 30px;
        margin-bottom: 50px;
        text-align: center;
    }
`

export default function GetAccess({ projectName, projectType, salePoints }: Props) {
    const [firstSalePoint, ...otherSalePoints] = salePoints

    const count = otherSalePoints.length

    if (!firstSalePoint) {
        return null
    }

    const { pricePerSecond, chainId, pricingTokenAddress } = firstSalePoint

    return (
        <>
            <GetAccessContainer>
                <img src={ProjectPng} />
                <h1>Get access to {projectName}</h1>
                <p>
                    The streams in this {getProjectTypeName(projectType)} can be accessed
                    for
                    <br />
                    <strong>
                        <PaymentRate
                            amount={new BigNumber(pricePerSecond)}
                            chainId={chainId}
                            pricingTokenAddress={pricingTokenAddress}
                            timeUnit={timeUnits.hour}
                            tag="span"
                        />
                    </strong>{' '}
                    on <strong>{formatChainName(getConfigForChain(chainId).name)}</strong>
                    {count > 0 && (
                        <>
                            and on {count} other chain{count > 1 && 's'}
                        </>
                    )}
                </p>
                <Button onClick={() => void console.log('PURCHASE')}>Get Access</Button>
            </GetAccessContainer>
            <PurchaseModal />
        </>
    )
}
