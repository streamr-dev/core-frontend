import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { REGULAR, TABLET } from '~/shared/utils/styled'
import Button from '~/shared/components/Button'
import { ProjectType, SalePoint } from '~/shared/types'
import FormattedPaymentRate from '~/components/FormattedPaymentRate'
import { formatChainName } from '~/utils'
import { WhiteBox } from '~/shared/components/WhiteBox'
import { getConfigForChain } from '~/shared/web3/config'
import { timeUnits } from '~/shared/utils/timeUnit'
import { getProjectTypeName } from '~/getters'
import {
    useIsProjectBeingPurchased,
    usePurchaseCallback,
} from '~/shared/stores/purchases'
import { errorToast } from '~/utils/toast'
import { useIsAccessibleByCurrentWallet } from '~/stores/projectDraft'
import { isAbandonment } from '~/modals/ProjectModal'
import routes from '~/routes'
import { toBN } from '~/utils/bn'

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
    const [firstSalePoint = undefined, ...otherSalePoints] = salePoints

    const prefix = `The streams in this ${getProjectTypeName(projectType)}`

    const count = otherSalePoints.length

    const purchase = usePurchaseCallback()

    const hasAccess = useIsAccessibleByCurrentWallet()

    const isBeingPurchased = useIsProjectBeingPurchased(projectId)

    if (!firstSalePoint) {
        return null
    }

    const { pricePerSecond, chainId, pricingTokenAddress } = firstSalePoint

    return (
        <WhiteBox className={'with-padding'}>
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
                            <FormattedPaymentRate
                                amount={toBN(pricePerSecond)}
                                chainId={chainId}
                                pricingTokenAddress={pricingTokenAddress}
                                timeUnit={timeUnits.hour}
                            />
                        </strong>{' '}
                        on{' '}
                        <strong>
                            {formatChainName(getConfigForChain(chainId).name)}
                        </strong>
                        {count > 0 && (
                            <>
                                {' '}
                                and on {count} other chain{count > 1 && 's'}
                            </>
                        )}
                        .
                    </p>
                )}
                {hasAccess === true && (
                    <Button tag={Link} to={routes.projects.connect({ id: projectId })}>
                        Connect
                    </Button>
                )}
                {hasAccess === false && (
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
                )}
                {typeof hasAccess === 'undefined' && (
                    <Button type="button" waiting>
                        Loading…
                    </Button>
                )}
            </DescriptionContainer>
        </WhiteBox>
    )
}
