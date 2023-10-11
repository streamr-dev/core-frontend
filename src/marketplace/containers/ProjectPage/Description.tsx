import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { REGULAR, TABLET } from '~/shared/utils/styled'
import Button from '~/shared/components/Button'
import { getProjectTypeName } from '~/getters'
import { ProjectType } from '~/shared/types'
import FormattedPaymentRate from '~/components/FormattedPaymentRate'
import { formatChainName } from '~/utils'
import { WhiteBox } from '~/shared/components/WhiteBox'
import { getConfigForChain } from '~/shared/web3/config'
import { timeUnits } from '~/shared/utils/timeUnit'
import {
    usePurchaseCallback,
    useIsProjectBeingPurchased,
} from '~/shared/stores/purchases'
import routes from '~/routes'
import { ParsedProject } from '~/parsers/ProjectParser'

export default function Description({ project }: { project: ParsedProject }) {
    const purchase = usePurchaseCallback()

    const isBeingPurchased = useIsProjectBeingPurchased(project?.id || '')

    const [payment = undefined, ...furtherPayments] = project.paymentDetails

    const chainName = payment ? getConfigForChain(payment.domainId).name : undefined

    const firstSalePoint = payment
        ? project.salePoints[getConfigForChain(payment.domainId).name]
        : undefined

    const numOfFurtherPayments = furtherPayments.length

    const invalid = !payment || !chainName || !firstSalePoint

    if (invalid) {
        /**
         * This shouldn't happen, at all. Ending up here means the project payment
         * information either got corrupted, or the schema changed and we've
         * got some catchng up to do.
         */
        return <></>
    }

    return (
        <WhiteBox className={'with-padding'}>
            <DescriptionContainer>
                <p>
                    <span>
                        The streams in this {getProjectTypeName(project.type)}
                        {project.type === ProjectType.OpenData
                            ? ' are public and '
                            : ''}{' '}
                        can be accessed for&nbsp;
                    </span>

                    <strong>
                        {project.type === ProjectType.OpenData ? (
                            'free'
                        ) : (
                            <FormattedPaymentRate
                                amount={firstSalePoint.pricePerSecond}
                                chainId={firstSalePoint.chainId}
                                pricingTokenAddress={firstSalePoint.pricingTokenAddress}
                                timeUnit={timeUnits.hour}
                            />
                        )}
                    </strong>
                    {project.type !== ProjectType.OpenData && (
                        <>
                            <span> on </span>
                            <strong>{formatChainName(chainName)}</strong>
                            {numOfFurtherPayments > 0 && (
                                <span>
                                    {' '}
                                    [and on {numOfFurtherPayments} other{' '}
                                    {numOfFurtherPayments === 1 ? 'chain' : 'chains'}]
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
