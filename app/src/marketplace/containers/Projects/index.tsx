import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import merge from 'lodash/merge'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import ProjectsComponent, { ProjectsContainer } from '$mp/components/Projects'
import ActionBar from '$mp/components/ActionBar'
import Layout from '$shared/components/Layout'
import Footer from '$shared/components/Layout/Footer'
import useModal from '$shared/hooks/useModal'
import CreateProductModal from '$mp/containers/CreateProductModal'
import type { Filter, ProjectList, SearchFilter } from '$mp/types/project-types'
import { getProducts, getProductsDebounced, updateFilter, clearFilters, updateProjectsAuthorFilter } from '$mp/modules/productList/actions'
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
import useContractProducts from '$shared/hooks/useContractProducts'
import { isAuthenticated } from '$shared/modules/user/selectors'
import styles from './projects.pcss'

const ProjectsPage: FunctionComponent = () => {
    const categories = useSelector(selectAllCategories)
    const projects = useSelector(selectProductList)
    const projectsError = useSelector(selectProductListError)
    const selectedFilter = useSelector(selectFilter)
    const isFetching = useSelector(selectFetchingProductList)
    const hasMoreSearchResults = useSelector(selectHasMoreSearchResults)
    const isUserAuthenticated = useSelector(isAuthenticated)
    const dispatch = useDispatch()
    const isMounted = useIsMounted()
    const productsRef = useRef<ProjectList>()
    productsRef.current = projects
    const [contractProducts, setContractProducts] = useState([])
    const { api: createProductModal } = useModal('marketplace.createProduct')
    const loadCategories = useCallback(() => dispatch(getCategories(false)), [dispatch])
    const { load: loadDataUnionStats, members, reset: resetStats } = useAllDataUnionStats()
    const loadProducts = useCallback(() => dispatch(getProducts()), [dispatch])
    const { load: loadContractProducts } = useContractProducts()
    const loadProductsFromContract = useCallback(async () => {
        if (productsRef.current) {
            const cps = await loadContractProducts(productsRef.current)

            if (isMounted()) {
                setContractProducts(cps)
            }
        }
    }, [loadContractProducts, isMounted])
    const onFilterChange = useCallback(
        (filter: Filter) => {
            dispatch(updateFilter(filter))
            dispatch(getProducts(true)).then((productIds) => {
                if (isMounted()) {
                    loadDataUnionStats(productIds)
                    loadProductsFromContract()
                }
            })
        },
        [dispatch, isMounted, loadDataUnionStats, loadProductsFromContract],
    )
    const onSearchChange = useCallback(
        (search: SearchFilter) => {
            dispatch(
                updateFilter({
                    search,
                }),
            )
            dispatch(
                getProductsDebounced({
                    replace: true,
                    onSuccess: (productIds) => {
                        if (isMounted()) {
                            loadDataUnionStats(productIds)
                            loadProductsFromContract()
                        }
                    },
                }),
            )
        },
        [dispatch, isMounted, loadDataUnionStats, loadProductsFromContract],
    )

    const onFilterByAuthorChange = useCallback((myProjects: boolean): void => {
        dispatch(
            updateProjectsAuthorFilter(myProjects),
        )
        dispatch(
            getProductsDebounced({
                replace: true,
                onSuccess: (productIds) => {
                    if (isMounted()) {
                        loadDataUnionStats(productIds)
                        loadProductsFromContract()
                    }
                },
            }),
        )
    }, [dispatch, isMounted, loadDataUnionStats, loadProductsFromContract])

    const clearFiltersAndReloadProducts = useCallback(() => {
        dispatch(clearFilters())
        dispatch(getProducts(true)).then((productIds) => {
            if (isMounted()) {
                loadDataUnionStats(productIds)
                loadProductsFromContract()
            }
        })
    }, [dispatch, isMounted, loadDataUnionStats, loadProductsFromContract])
    useEffect(() => {
        loadCategories()

        if (productsRef.current && productsRef.current.length === 0) {
            clearFiltersAndReloadProducts()
        } else if (productsRef.current && productsRef.current.length > 0) {
            // just reload DU stats if product list was cached
            loadDataUnionStats(productsRef.current.map(({ id }) => id))
            loadProductsFromContract()
        }
    }, [loadCategories, clearFiltersAndReloadProducts, loadDataUnionStats, loadProductsFromContract])
    useEffect(
        () => () => {
            resetStats()
        },
        [resetStats],
    )
    return (
        <Layout framedClassName={styles.productsFramed} innerClassName={styles.productsInner} footer={false}>
            <MarketplaceHelmet />
            <ActionBar
                filter={selectedFilter}
                categories={categories}
                onFilterChange={onFilterChange}
                onSearchChange={onSearchChange}
                onCreateProject={() => createProductModal.open()}
                onFilterByAuthorChange={onFilterByAuthorChange}
                isUserAuthenticated={isUserAuthenticated}
            />
            <CreateProductModal />
            <ProjectsContainer fluid>
                <ProjectsComponent
                    projects={projects.map((p, i) => {
                        const beneficiaryAddress = (p.beneficiaryAddress || '').toLowerCase()
                        const contractProd = contractProducts.find((cp) => cp.id === p.id)
                        const pricingTokenAddress = contractProd ? contractProd.pricingTokenAddress : null
                        const pricePerSecond = contractProd ? contractProd.pricePerSecond : p.pricePerSecond
                        return merge({}, p, {
                            key: `${i}-${p.id || ''}`,
                            members: members[beneficiaryAddress],
                            pricingTokenAddress,
                            pricePerSecond,
                        })
                    })}
                    error={projectsError}
                    type="projects"
                    isFetching={isFetching}
                    loadProducts={loadProducts}
                    hasMoreSearchResults={hasMoreSearchResults}
                />
            </ProjectsContainer>
            <Footer topBorder />
        </Layout>
    )
}

export default ProjectsPage
