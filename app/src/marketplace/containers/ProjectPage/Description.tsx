import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Project, SalePoint } from '$mp/types/project-types'
import { REGULAR, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import { projectTypeNames } from '$mp/utils/constants'
import { ProjectType } from '$shared/types'
import PaymentRate from '$mp/components/PaymentRate'
import { formatChainName } from '$shared/utils/chains'
import { WhiteBox } from '$shared/components/WhiteBox'
import { getConfigForChain } from '$shared/web3/config'
import { timeUnits } from '$shared/utils/timeUnit'
import { usePurchaseCallback, useIsProjectBeingPurchased } from '$shared/stores/purchases'
import routes from '$routes'

const Description: FunctionComponent<{ project: Project }> = ({ project }) => {
    const firstSalePoint = useMemo<SalePoint>(
        () => Object.values(project.salePoints)[0],
        [project.salePoints],
    )
    const firstSalePointChainName = useMemo<string>(
        () => getConfigForChain(firstSalePoint.chainId).name,
        [firstSalePoint],
    )
    const moreSalePoints = useMemo<number>(
        () => Object.values(project.salePoints).length - 1,
        [project.salePoints],
    )

    const purchase = usePurchaseCallback()

    const isBeingPurchased = useIsProjectBeingPurchased(project?.id || '')

    return (
        <WhiteBox className={'with-padding'}>
            <DescriptionContainer>
                <p>
                    <span>
                        The streams in this {projectTypeNames[project.type]}
                        {project.type === ProjectType.OpenData
                            ? ' are public and '
                            : ''}{' '}
                        can be accessed for&nbsp;
                    </span>

                    <strong>
                        {project.type === ProjectType.OpenData ? (
                            'free'
                        ) : (
                            <PaymentRate
                                amount={firstSalePoint.pricePerSecond}
                                chainId={firstSalePoint.chainId}
                                pricingTokenAddress={firstSalePoint.pricingTokenAddress}
                                timeUnit={timeUnits.hour}
                                tag={'span'}
                            />
                        )}
                    </strong>
                    {project.type !== ProjectType.OpenData && (
                        <>
                            <span> on </span>
                            <strong>{formatChainName(firstSalePointChainName)}</strong>
                            {moreSalePoints > 0 && (
                                <span>
                                    {' '}
                                    [and on {moreSalePoints} other{' '}
                                    {moreSalePoints === 1 ? 'chain' : 'chains'}]
                                </span>
                            )}
                        </>
                    )}
                </p>
                {project.type === ProjectType.OpenData && (
                    <Button tag={Link} to={routes.projects.connect({ id: project.id })}>
                        Connect
                    </Button>
                )}
                {project.type !== ProjectType.OpenData && (
                    <Button
                        disabled={isBeingPurchased}
                        onClick={async () => {
                            try {
                                if (!project?.id) {
                                    return
                                }

                                await purchase(project.id)
                            } catch (e) {
                                console.warn('Purchase failed', e)
                            }
                        }}
                    >
                        Get Access
                    </Button>
                )}
            </DescriptionContainer>
        </WhiteBox>
    )
}

export default Description

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
        @media (${TABLET}) {
            width: auto;
            margin-top: 0;
            margin-left: 20px;
        }
    }

    @media (${TABLET}) {
        flex-direction: row;
    }
`
