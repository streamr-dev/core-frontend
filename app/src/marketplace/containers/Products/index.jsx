// @flow

import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import merge from 'lodash/merge'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import ProductsComponent from '$mp/components/Products'
import ActionBar from '$mp/components/ActionBar'
import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'
import useModal from '$shared/hooks/useModal'
import CreateProductModal from '$mp/containers/CreateProductModal'

import type { Filter, SearchFilter } from '$mp/flowtype/product-types'

import {
    getProducts,
    getProductsDebounced,
    updateFilter,
    clearFilters,
} from '$mp/modules/productList/actions'
import { getCategories } from '$mp/modules/categories/actions'
import { selectAllCategories } from '$mp/modules/categories/selectors'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'
import {
    selectProductList,
    selectProductListError,
    selectFilter,
    selectFetchingProductList,
    selectHasMoreSearchResults,
} from '$mp/modules/productList/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'

import styles from './products.pcss'

const Products = () => {
    const categories = useSelector(selectAllCategories)
    const products = useSelector(selectProductList)
    const productsError = useSelector(selectProductListError)
    const selectedFilter = useSelector(selectFilter)
    const isFetching = useSelector(selectFetchingProductList)
    const hasMoreSearchResults = useSelector(selectHasMoreSearchResults)
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const productsRef = useRef()
    productsRef.current = products

    const { api: createProductModal } = useModal('marketplace.createProduct')

    const loadCategories = useCallback(() => dispatch(getCategories(false)), [dispatch])
    const { load: loadDataUnionStats, members, reset: resetStats } = useAllDataUnionStats()

    const loadProducts = useCallback(() => dispatch(getProducts()), [dispatch])

    const onFilterChange = useCallback((filter: Filter) => {
        dispatch(updateFilter(filter))
        dispatch(getProducts(true))
            .then((productIds) => {
                if (isMounted()) {
                    loadDataUnionStats(productIds)
                }
            })
    }, [dispatch, isMounted, loadDataUnionStats])

    const onSearchChange = useCallback((search: SearchFilter) => {
        dispatch(updateFilter({
            search,
        }))
        dispatch(getProductsDebounced({
            replace: true,
            onSuccess: (productIds) => {
                if (isMounted()) {
                    loadDataUnionStats(productIds)
                }
            },
        }))
    }, [dispatch, isMounted, loadDataUnionStats])

    const clearFiltersAndReloadProducts = useCallback(() => {
        dispatch(clearFilters())
        dispatch(getProducts(true))
            .then((productIds) => {
                if (isMounted()) {
                    loadDataUnionStats(productIds)
                }
            })
    }, [dispatch, isMounted, loadDataUnionStats])

    useEffect(() => {
        loadCategories()

        if (productsRef.current && productsRef.current.length === 0) {
            clearFiltersAndReloadProducts()
        }
    }, [loadCategories, clearFiltersAndReloadProducts])

    useEffect(() => () => {
        resetStats()
    }, [resetStats])

    return (
        <Layout
            framedClassname={styles.productsFramed}
            innerClassname={styles.productsInner}
            footer={false}
        >
            <MarketplaceHelmet />
            <ActionBar
                filter={selectedFilter}
                categories={categories}
                onFilterChange={onFilterChange}
                onSearchChange={onSearchChange}
                onCreateProduct={() => createProductModal.open()}
            />
            <CreateProductModal />
            <ProductsComponent.Container fluid>
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
            </ProductsComponent.Container>
            <Footer topBorder />
        </Layout>
    )
}

export default Products
