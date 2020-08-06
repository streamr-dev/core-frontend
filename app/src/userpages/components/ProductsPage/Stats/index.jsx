// @flow

import React, { useEffect } from 'react'
import Helmet from 'react-helmet'
import { I18n } from 'react-redux-i18n'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import styled from 'styled-components'

import CoreLayout from '$shared/components/Layout/Core'
import coreLayoutStyles from '$shared/components/Layout/core.pcss'
import Header from '../Header'
import ListContainer from '$shared/components/Container/List'
import { isEthereumAddress } from '$mp/utils/validate'
import ProductController, { useController } from '$mp/containers/ProductController'
import usePending from '$shared/hooks/usePending'
import useProduct from '$mp/containers/ProductController/useProduct'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import useDataUnionStats from '$mp/containers/ProductPage/useDataUnionStats'
import DataUnionPending from '$mp/components/ProductPage/DataUnionPending'
import StatsValues from '$shared/components/DataUnionStats'
import MembersGraph from '$mp/containers/ProductPage/MembersGraph'
import SubscriberGraph from '$mp/containers/ProductPage/SubscriberGraph'
import ResourceNotFoundError, { ResourceType } from '$shared/errors/ResourceNotFoundError'
import { isDataUnionProduct } from '$mp/utils/product'
import Nav from '$shared/components/Layout/Nav'
import { MD, LG } from '$shared/utils/styled'

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
    const { loadDataUnion } = useController()
    const product = useProduct()
    const { stats, memberCount } = useDataUnionStats()
    const dataUnion = useDataUnion()

    const { joinPartStreamId } = dataUnion || {}

    const { dataUnionDeployed, beneficiaryAddress } = product

    useEffect(() => {
        if (dataUnionDeployed && beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress)
        }
    }, [dataUnionDeployed, beneficiaryAddress, loadDataUnion])

    return (
        <CoreLayout
            footer={false}
            nav={(
                <Nav noWide />
            )}
            navComponent={(
                <Header
                    searchComponent={
                        <div className={styles.searchPlaceholder} />
                    }
                />
            )}
            contentClassname={cx(styles.contentArea, coreLayoutStyles.pad)}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.stats')}`} />
            <StyledListContainer>
                {!!dataUnionDeployed && (
                    <div className={styles.graphs}>
                        <div className={styles.statBox}>
                            {!dataUnionDeployed && isEthereumAddress(beneficiaryAddress) && (
                                <DataUnionPending />
                            )}
                            {!!dataUnionDeployed && stats && (
                                <StatsValues
                                    className={styles.stats}
                                    stats={stats}
                                />
                            )}
                        </div>
                        <div className={styles.memberCount}>
                            {!!dataUnionDeployed && memberCount && (
                                <MembersGraph
                                    className={styles.graph}
                                    joinPartStreamId={joinPartStreamId}
                                    memberCount={memberCount.total}
                                />
                            )}
                        </div>
                        <div className={styles.graphBox}>
                            {!!dataUnionDeployed && product && (
                                <SubscriberGraph
                                    className={styles.graph}
                                    productId={product.id}
                                />
                            )}
                        </div>
                    </div>
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
                    <div className={styles.searchPlaceholder} />
                }
            />
        )}
        contentClassname={cx(styles.contentArea, coreLayoutStyles.pad)}
        loading
    />
)

const StatsWrap = () => {
    const product = useProduct()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!product || loadPending || permissionsPending) {
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
