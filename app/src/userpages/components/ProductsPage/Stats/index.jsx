// @flow

import React, { useEffect, useCallback } from 'react'
import Helmet from 'react-helmet'
import { I18n } from 'react-redux-i18n'
import { withRouter } from 'react-router-dom'

import CoreLayout from '$shared/components/Layout/Core'
import Header from '../Header'
import ListContainer from '$shared/components/Container/List'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import Layout from '$shared/components/Layout'
import type { CommunityId } from '$mp/flowtype/product-types'
import { isEthereumAddress } from '$mp/utils/validate'
import ProductController, { useController } from '$mp/containers/ProductController'
import usePending from '$shared/hooks/usePending'
import useProduct from '$mp/containers/ProductController/useProduct'
import useCommunityProduct from '$mp/containers/ProductController/useCommunityProduct'
import useCommunityStats from '$mp/containers/ProductPage/useCommunityStats'
import CommunityPending from '$mp/components/ProductPage/CommunityPending'
import StatsValues from '$shared/components/CommunityStats/Values'
import MembersGraph from '$mp/containers/ProductPage/MembersGraph'

import styles from './stats.pcss'

const Stats = () => {
    const { loadCommunityProduct } = useController()
    const product = useProduct()
    const { statsArray, memberCount } = useCommunityStats()
    const community = useCommunityProduct()

    const { joinPartStreamId } = community || {}

    const loadCommunity = useCallback(async (id: CommunityId) => {
        loadCommunityProduct(id)
    }, [loadCommunityProduct])

    const { communityDeployed, beneficiaryAddress } = product

    useEffect(() => {
        if (communityDeployed && beneficiaryAddress) {
            loadCommunity(beneficiaryAddress)
        }
    }, [communityDeployed, beneficiaryAddress, loadCommunity])

    return (
        <CoreLayout
            footer={false}
            hideNavOnDesktop
            navComponent={(
                <Header />
            )}
            contentClassname={styles.contentArea}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.products')}`} />
            <ListContainer>
                <div className={styles.statBox}>
                    {!communityDeployed && isEthereumAddress(beneficiaryAddress) && (
                        <CommunityPending />
                    )}
                    {!!communityDeployed && statsArray && (
                        <StatsValues
                            className={styles.stats}
                            stats={statsArray}
                        />
                    )}
                </div>
                <div className={styles.graphs}>
                    <div className={styles.statBox}>
                        {!!communityDeployed && memberCount && (
                            <MembersGraph
                                joinPartStreamId={joinPartStreamId}
                                memberCount={memberCount.total}
                            />
                        )}
                    </div>
                    <div className={styles.statBox}>
                        subscribers
                    </div>
                </div>
            </ListContainer>
        </CoreLayout>
    )
}

const LoadingView = () => (
    <Layout nav={false}>
        <LoadingIndicator loading className={styles.loadingIndicator} />
    </Layout>
)

const StatsWrap = () => {
    const product = useProduct()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!product || loadPending || permissionsPending) {
        return <LoadingView />
    }

    const key = (!!product && product.id) || ''

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
