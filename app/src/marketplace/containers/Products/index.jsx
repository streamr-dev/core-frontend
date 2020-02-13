// @flow

import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import merge from 'lodash/merge'
import Helmet from 'react-helmet'
import { I18n } from 'react-redux-i18n'

import ProductsComponent from '$mp/components/Products'
import ActionBar from '$mp/components/ActionBar'
import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'
import useModal from '$shared/hooks/useModal'
import CreateProductModal from '$mp/containers/CreateProductModal'

import type { Filter } from '$mp/flowtype/product-types'

import {
    getProducts,
    getProductsDebounced,
    updateFilter,
    clearFilters,
} from '$mp/modules/productList/actions'
import { getCategories } from '$mp/modules/categories/actions'
import { selectAllCategories } from '$mp/modules/categories/selectors'
import useMemberStats from '$mp/modules/dataUnion/hooks/useMemberStats'
import {
    selectProductList,
    selectProductListError,
    selectFilter,
    selectFetchingProductList,
    selectHasMoreSearchResults,
} from '$mp/modules/productList/selectors'

import styles from './products.pcss'

const Products = () => {
    const categories = useSelector(selectAllCategories)
    const products = useSelector(selectProductList)
    const productsError = useSelector(selectProductListError)
    const selectedFilter = useSelector(selectFilter)
    const isFetching = useSelector(selectFetchingProductList)
    const hasMoreSearchResults = useSelector(selectHasMoreSearchResults)
    const dispatch = useDispatch()
    const productsRef = useRef()
    productsRef.current = products

    const { api: createProductModal } = useModal('marketplace.createProduct')

    const loadCategories = useCallback(() => dispatch(getCategories(false)), [dispatch])
    const { load: loadCommunities, members } = useMemberStats()

    const loadProducts = useCallback(() => dispatch(getProducts()), [dispatch])

    const onFilterChange = useCallback((filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProducts(true))
    }, [dispatch])

    const onSearchChange = useCallback((filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProductsDebounced(true))
    }, [dispatch])

    const clearFiltersAndReloadProducts = useCallback(() => {
        dispatch(clearFilters())
        dispatch(getProducts(true))
    }, [dispatch])

    useEffect(() => {
        loadCategories()
        loadCommunities()

        if (productsRef.current && productsRef.current.length === 0) {
            clearFiltersAndReloadProducts()
        }
    }, [loadCommunities, loadCategories, clearFiltersAndReloadProducts])

    return (
        <Layout
            framedClassname={styles.productsFramed}
            innerClassname={styles.productsInner}
            footer={false}
        >
            <Helmet title={I18n.t('general.title.suffix')} />
            <ActionBar
                filter={selectedFilter}
                categories={categories}
                onCategoryChange={onFilterChange}
                onSortChange={onFilterChange}
                onSearchChange={onSearchChange}
                onCreateProduct={() => createProductModal.open()}
            />
            <CreateProductModal />
            <ProductsComponent
                products={products.map((p, i) => {
                    const beneficiaryAddress = (p.beneficiaryAddress || '').toLowerCase()

                    return merge({}, p, {
                        key: `${i}-${p.id || ''}`,
                        members: members[beneficiaryAddress],
                    })
                })}
                error={productsError}
                type="products"
                isFetching={isFetching}
                loadProducts={loadProducts}
                hasMoreSearchResults={hasMoreSearchResults}
            />
            <Footer topBorder />
        </Layout>
    )
}

export default Products
