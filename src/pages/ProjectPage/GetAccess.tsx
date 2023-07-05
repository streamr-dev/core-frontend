import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import PaymentRate from '~/marketplace/components/PaymentRate'
import { formatChainName } from '~/shared/utils/chains'
import Button from '~/shared/components/Button'
import ProjectPng from '~/shared/assets/images/project.png'
import { MEDIUM } from '~/shared/utils/styled'
import { getConfigForChain } from '~/shared/web3/config'
import { timeUnits } from '~/shared/utils/timeUnit'
import { ProjectType, SalePoint } from '~/shared/types'
import { getProjectTypeName } from '~/getters'
import {
    useIsProjectBeingPurchased,
    usePurchaseCallback,
} from '~/shared/stores/purchases'
import { errorToast } from '~/utils/toast'
import { isAbandonment } from '~/modals/ProjectModal'

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

interface Props {
    projectId: string
    projectType: ProjectType
    projectName: string
    salePoints: SalePoint[]
}

export default function GetAccess({
    projectId,
    projectName,
    projectType,
    salePoints,
}: Props) {
    const [firstSalePoint, ...otherSalePoints] = salePoints

    const count = otherSalePoints.length

    const purchase = usePurchaseCallback()

    const isBeingPurchased = useIsProjectBeingPurchased(projectId)

    if (!firstSalePoint) {
        return null
    }

    const { pricePerSecond, chainId, pricingTokenAddress } = firstSalePoint

    return (
        <>
            <GetAccessContainer>
                <img src={ProjectPng} alt="Get access" width="290" height="265" />
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
                <Button
                    type="button"
                    waiting={isBeingPurchased}
                    onClick={async () => {
                        try {
                            await purchase(projectId)
                        } catch (e) {
                            if (isAbandonment(e)) {
                                return
                            }

                            console.warn('Purchase failed', e)

                            errorToast({
                                title: 'Purchase failed',
                            })
                        }
                    }}
                >
                    Get access
                </Button>
            </GetAccessContainer>
        </>
    )
}
