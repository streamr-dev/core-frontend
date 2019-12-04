// @flow

import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import merge from 'lodash/merge'
import Helmet from 'react-helmet'
import { I18n } from 'react-redux-i18n'

import ProductsComponent from '../../components/Products'
import ActionBar from '../../components/ActionBar'
import Layout from '$shared/components/Layout'
import useModal from '$shared/hooks/useModal'
import CreateProductModal from '$mp/containers/CreateProductModal'

import type { Filter } from '../../flowtype/product-types'

import {
    getProducts,
    getProductsDebounced,
    updateFilter,
    clearFilters,
} from '../../modules/productList/actions'
import { getCategories } from '../../modules/categories/actions'
import { selectAllCategories } from '../../modules/categories/selectors'
import {
    selectProductList,
    selectProductListError,
    selectFilter,
    selectFetchingProductList,
    selectHasMoreSearchResults,
} from '../../modules/productList/selectors'

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

        if (productsRef.current && productsRef.current.length === 0) {
            clearFiltersAndReloadProducts()
        }
    }, [loadCategories, clearFiltersAndReloadProducts])

    return (
        <Layout>
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
                products={products.map((p, i) => merge({}, p, {
                    key: `${i}-${p.id || ''}`,
                }))}
                error={productsError}
                type="products"
                isFetching={isFetching}
                loadProducts={loadProducts}
                hasMoreSearchResults={hasMoreSearchResults}
            />
        </Layout>
    )
}

export default Products
