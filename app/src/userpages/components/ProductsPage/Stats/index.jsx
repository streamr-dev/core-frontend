// @flow

import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import styled from 'styled-components'

import { CoreHelmet } from '$shared/components/Helmet'
import CoreLayout from '$shared/components/Layout/Core'
import coreLayoutStyles from '$shared/components/Layout/core.pcss'
import ListContainer from '$shared/components/Container/List'
import { isEthereumAddress } from '$mp/utils/validate'
import ProductController, { useController } from '$mp/containers/ProductController'
import usePending from '$shared/hooks/usePending'
import useProduct from '$mp/containers/ProductController/useProduct'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import usePreviewStats from '$mp/containers/ProductPage/usePreviewStats'
import useDataUnionServerStats from '$mp/containers/ProductPage/useDataUnionServerStats'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import ProductStat from '$shared/components/ProductStat'
import MembersGraph from '$mp/containers/ProductPage/MembersGraph'
import SubscriberGraph from '$mp/containers/ProductPage/SubscriberGraph'
import ResourceNotFoundError, { ResourceType } from '$shared/errors/ResourceNotFoundError'
import { isDataUnionProduct } from '$mp/utils/product'
import Nav from '$shared/components/Layout/Nav'
import { MD, LG } from '$shared/utils/styled'
import DaysPopover from '$shared/components/DaysPopover'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import Search from '$userpages/components/Header/Search'
import Header from '../Header'

import styles from './stats.pcss'

const StyledListContainer = styled(ListContainer)`
    && {
        padding: 0;
        margin-bottom: 4em;
    }

    @media (min-width: ${MD}px) {
        && {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }

    @media (min-width: ${LG}px) {
        && {
            margin-bottom: 0;
        }
    }
`

const Stats = () => {
    const { loadDataUnion, loadContractProductSubscription } = useController()
    const product = useProduct()
    const { id: productId } = product
    const contractProduct = useContractProduct()

    const { subscriberCount } = contractProduct || {
        subscriberCount: 0,
    }
    const { created, adminFee, dataUnionDeployed, beneficiaryAddress } = product

    const { startPolling, stopPolling, totalEarnings, memberCount } = useDataUnionServerStats()
    const stats = usePreviewStats({
        beneficiaryAddress,
        created,
        adminFee,
        subscriberCount,
        totalEarnings,
        memberCount,
    })
    const dataUnion = useDataUnion()

    const { joinPartStreamId } = dataUnion || {}

    useEffect(() => {
        if (beneficiaryAddress) {
            startPolling(beneficiaryAddress)

            return () => stopPolling()
        }

        return () => {}
    }, [beneficiaryAddress, startPolling, stopPolling])

    useEffect(() => {
        if (productId) {
            loadContractProductSubscription(productId)
        }
    }, [productId, loadContractProductSubscription])

    useEffect(() => {
        if (dataUnionDeployed && beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress)
        }
    }, [dataUnionDeployed, beneficiaryAddress, loadDataUnion])

    const [membersDays, setMembersDays] = useState(7)

    const [subsDays, setSubsDays] = useState(7)

    return (
        <CoreLayout
            footer={false}
            nav={(
                <Nav noWide />
            )}
            navComponent={(
                <Header
                    searchComponent={
                        <Search.Disabled />
                    }
                />
            )}
            contentClassname={cx(styles.contentArea, coreLayoutStyles.pad)}
        >
            <CoreHelmet title="Overview" />
            <StyledListContainer>
                {!dataUnionDeployed && isEthereumAddress(beneficiaryAddress) && (
                    <div className={styles.statBox}>
                        <DataUnionPending />
                    </div>
                )}
                {!!dataUnionDeployed && (
                    <React.Fragment>
                        <div className={styles.statBox}>
                            {stats && (
                                <ProductStat.List items={stats} />
                            )}
                        </div>
                        <div className={styles.graphs}>
                            <div className={styles.memberCount}>
                                {!!memberCount && (
                                    <React.Fragment>
                                        <TimeSeriesGraph.Header>
                                            <ProductStat.Title>
                                                Members
                                            </ProductStat.Title>
                                            <DaysPopover
                                                onChange={setMembersDays}
                                                selectedItem={`${membersDays}`}
                                            />
                                        </TimeSeriesGraph.Header>
                                        <MembersGraph
                                            joinPartStreamId={joinPartStreamId}
                                            memberCount={memberCount.total}
                                            shownDays={membersDays}
                                        />
                                    </React.Fragment>
                                )}
                            </div>
                            <div className={styles.graphBox}>
                                {product && (
                                    <React.Fragment>
                                        <TimeSeriesGraph.Header>
                                            <ProductStat.Title>
                                                Subscribers
                                            </ProductStat.Title>
                                            <DaysPopover
                                                onChange={setSubsDays}
                                                selectedItem={`${subsDays}`}
                                            />
                                        </TimeSeriesGraph.Header>
                                        <SubscriberGraph
                                            productId={product.id}
                                            shownDays={subsDays}
                                        />
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </StyledListContainer>
        </CoreLayout>
    )
}

const LoadingView = () => (
    <CoreLayout
        footer={false}
        nav={(
            <Nav noWide />
        )}
        navComponent={(
            <Header
                searchComponent={
                    <Search.Disabled />
                }
            />
        )}
        contentClassname={cx(styles.contentArea, coreLayoutStyles.pad)}
        loading
    />
)

const StatsWrap = () => {
    const product = useProduct()
    const { hasLoaded } = useController()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!hasLoaded || !product || loadPending || permissionsPending) {
        return <LoadingView />
    }

    // show not found if DU is not actually yet deployed
    const { id, beneficiaryAddress } = product

    if (!isDataUnionProduct(product) || !beneficiaryAddress) {
        throw new ResourceNotFoundError(ResourceType.PRODUCT, id)
    }

    const key = (!!product && id) || ''

    return (
        <Stats key={key} />
    )
}

const StatsContainer = withRouter((props) => (
    <ProductController key={props.match.params.id}>
        <StatsWrap />
    </ProductController>
))

export default () => (
    <StatsContainer />
)
