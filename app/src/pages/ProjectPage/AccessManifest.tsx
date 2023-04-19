import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { REGULAR, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import { ProjectType } from '$shared/types'
import PaymentRate from '$mp/components/PaymentRate'
import { formatChainName } from '$shared/utils/chains'
import { WhiteBox } from '$shared/components/WhiteBox'
import { getConfigForChain } from '$shared/web3/config'
import { timeUnits } from '$shared/utils/timeUnit'
import { getProjectTypeName } from '$app/src/getters'
import { SalePoint  } from '$shared/types'
import routes from '$routes'

const DescriptionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    font-weight: ${REGULAR};
    flex-direction: column;

    p {
        margin: 0;
    }

    a {
        width: 100%;
        margin-top: 20px;
    }

    @media (${TABLET}) {
        flex-direction: row;

        a {
            width: auto;
            margin-top: 0;
            margin-left: 20px;
        }
    }
`

interface Props {
    projectId: string
    projectType: ProjectType
    salePoints: SalePoint[]
}

export default function AccessManifest({ projectId, projectType, salePoints }: Props) {
    const [firstSalePoint, ...otherSalePoints] = salePoints

    const prefix = `The streams in this ${getProjectTypeName(projectType)}`

    const count = otherSalePoints.length

    if (!firstSalePoint) {
        return null
    }

    const { pricePerSecond, chainId, pricingTokenAddress } = firstSalePoint

    return (
        <WhiteBox>
            <DescriptionContainer>
                {projectType === ProjectType.OpenData ? (
                    <p>
                        {prefix} are public and can be accessed for <strong>free</strong>.
                    </p>
                ) : (
                    <p>
                        {prefix} can be accessed for{' '}
                        <strong>
                            {' '}
                            <PaymentRate
                                amount={new BigNumber(pricePerSecond)}
                                chainId={chainId}
                                pricingTokenAddress={pricingTokenAddress}
                                timeUnit={timeUnits.hour}
                                tag="span"
                            />
                        </strong>{' '}
                        on{' '}
                        <strong>
                            {formatChainName(getConfigForChain(chainId).name)}
                        </strong>
                        {count > 0 && (
                            <>
                                and on {count} other chain{count > 1 && 's'}
                            </>
                        )}
                        .
                    </p>
                )}
                {projectType === ProjectType.OpenData && (
                    <Button tag={Link} to={routes.projects.connect({ id: projectId })}>
                        Connect
                    </Button>
                )}
                {projectType !== ProjectType.OpenData && (
                    <Button type="button" onClick={() => void console.log('MODAL')}>
                        Get Access
                    </Button>
                )}
            </DescriptionContainer>
        </WhiteBox>
    )
}
