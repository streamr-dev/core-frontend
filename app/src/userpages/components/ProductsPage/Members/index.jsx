// @flow

import React, { useEffect, useCallback, useMemo } from 'react'
import Helmet from 'react-helmet'
import { I18n } from 'react-redux-i18n'
import { withRouter } from 'react-router-dom'

import CoreLayout from '$shared/components/Layout/Core'
import Header from '../Header'
import ListContainer from '$shared/components/Container/List'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import Layout from '$shared/components/Layout'
import Search from '$userpages/components/Header/Search'
import Dropdown from '$shared/components/Dropdown'
import type { CommunityId } from '$mp/flowtype/product-types'
import { getFilters } from '$userpages/utils/constants'
import ProductController, { useController } from '$mp/containers/ProductController'
import usePending from '$shared/hooks/usePending'
import useProduct from '$mp/containers/ProductController/useProduct'
import useFilterSort from '$userpages/hooks/useFilterSort'

import styles from './members.pcss'

const Members = () => {
    const { loadCommunityProduct } = useController()
    const product = useProduct()
    const sortOptions = useMemo(() => {
        const filters = getFilters()
        return [
            filters.RECENT,
            filters.NAME_ASC,
            filters.NAME_DESC,
        ]
    }, [])

    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)

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
                <Header
                    searchComponent={
                        <Search
                            placeholder={I18n.t('userpages.members.filterMembers')}
                            value={(filter && filter.search) || ''}
                            onChange={setSearch}
                        />
                    }
                    filterComponent={
                        <Dropdown
                            title={I18n.t('userpages.filter.sortBy')}
                            onChange={setSort}
                            selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                        >
                            {sortOptions.map((s) => (
                                <Dropdown.Item key={s.filter.id} value={s.filter.id}>
                                    {s.displayName}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    }
                />
            )}
        >
            <Helmet title={`Streamr Core | ${I18n.t('userpages.title.members')}`} />
            <ListContainer>
                TODO: members list missing
            </ListContainer>
        </CoreLayout>
    )
}

const LoadingView = () => (
    <Layout nav={false}>
        <LoadingIndicator loading className={styles.loadingIndicator} />
    </Layout>
)

const MembersWrap = () => {
    const product = useProduct()
    const { isPending: loadPending } = usePending('product.LOAD')
    const { isPending: permissionsPending } = usePending('product.PERMISSIONS')

    if (!product || loadPending || permissionsPending) {
        return <LoadingView />
    }

    const key = (!!product && product.id) || ''

    return (
        <Members key={key} />
    )
}

const MembersContainer = withRouter((props) => (
    <ProductController key={props.match.params.id}>
        <MembersWrap />
    </ProductController>
))

export default () => (
    <MembersContainer />
)
