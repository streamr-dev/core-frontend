import React, { useMemo, useEffect, useState, useReducer, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { usePending } from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import { Provider as PermissionsProvider } from './useProductPermissions'
import { Provider as ValidationContextProvider } from './ValidationContextProvider'

import useProductLoadCallback from './useProductLoadCallback'
import useContractProductLoadCallback from './useContractProductLoadCallback'
import useProductValidationEffect from './useProductValidationEffect'
import useContractProductSubscriptionLoadCallback from './useContractProductSubscriptionLoadCallback'
import useLoadCategoriesCallback from './useLoadCategoriesCallback'
import useLoadProductStreamsCallback from './useLoadProductStreamsCallback'
import useDataUnionLoadCallback from './useDataUnionLoadCallback'
import useDataUnionStatsLoadCallback from './useDataUnionStatsLoadCallback'
import useRelatedProductsLoadCallback from './useRelatedProductsLoadCallback'
import useLoadAllStreamsCallback from './useLoadAllStreamsCallback'
import useResetDataUnionCallback from './useResetDataUnionCallback'
import useController, { ProductControllerContext } from './useController'

export { useController }

function useProductLoadEffect({ ignoreUnauthorized, requirePublished, useAuthorization }) {
    const [loadedOnce, setLoadedOnce] = useState(false)
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
    const { isPending } = usePending('product.LOAD')
    const isMounted = useIsMounted()
    const { id: urlId } = useParams()

    useEffect(() => {
        if (urlId && !loadedOnce && !isPending) {
            // load product if needed and not already loading
            loadProduct({
                productId: urlId,
                ignoreUnauthorized,
                requirePublished,
                useAuthorization,
            })
            loadContractProduct(urlId)
            setLoadedOnce(true)
        }
    }, [
        urlId,
        loadedOnce,
        loadProduct,
        loadContractProduct,
        isPending,
        ignoreUnauthorized,
        useAuthorization,
        requirePublished,
        isMounted,
    ])
}

function ProductEffects({ ignoreUnauthorized, requirePublished, useAuthorization }) {
    useProductLoadEffect({
        ignoreUnauthorized,
        requirePublished,
        useAuthorization,
    })
    useProductValidationEffect()

    return null
}

function reducer(state, action) {
    switch (action.type) {
        case 'setProduct':
            return {
                ...state,
                product: action.product,
                hasLoaded: true,
            }

        case 'setProductStreams':
            return {
                ...state,
                productStreams: [
                    ...state.productStreams,
                    ...action.streams,
                ],
            }

        case 'setAllStreams':
            return {
                ...state,
                allStreams: action.streams,
            }

        default:
            break
    }

    return state
}

function useProductController() {
    const [{ hasLoaded, product, productStreams, allStreams }, dispatch] = useReducer(reducer, {
        hasLoaded: false,
        product: undefined,
        productStreams: [],
        allStreams: [],
    })

    const setProduct = useCallback((nextProduct) => {
        dispatch({
            type: 'setProduct',
            product: nextProduct,
        })
    }, [dispatch])

    const setProductStreams = useCallback((nextStreams) => {
        dispatch({
            type: 'setProductStreams',
            streams: nextStreams,
        })
    }, [dispatch])

    const setAllStreams = useCallback((nextStreams) => {
        dispatch({
            type: 'setAllStreams',
            streams: nextStreams,
        })
    }, [dispatch])

    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
    const loadContractProductSubscription = useContractProductSubscriptionLoadCallback()
    const loadCategories = useLoadCategoriesCallback()
    const loadProductStreams = useLoadProductStreamsCallback({
        setProductStreams,
    })
    const loadDataUnion = useDataUnionLoadCallback()
    const loadDataUnionStats = useDataUnionStatsLoadCallback()
    const loadRelatedProducts = useRelatedProductsLoadCallback()
    const loadAllStreams = useLoadAllStreamsCallback({
        setAllStreams,
    })
    const resetDataUnion = useResetDataUnionCallback()

    return useMemo(() => ({
        hasLoaded,
        product,
        setProduct,
        productStreams,
        setProductStreams,
        allStreams,
        setAllStreams,
        loadProduct,
        loadContractProduct,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadDataUnionStats,
        loadRelatedProducts,
        loadAllStreams,
        resetDataUnion,
    }), [
        hasLoaded,
        product,
        setProduct,
        productStreams,
        setProductStreams,
        allStreams,
        setAllStreams,
        loadProduct,
        loadContractProduct,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadDataUnionStats,
        loadRelatedProducts,
        loadAllStreams,
        resetDataUnion,
    ])
}

function ControllerProvider({ children }) {
    return (
        <ProductControllerContext.Provider value={useProductController()}>
            {children}
        </ProductControllerContext.Provider>
    )
}

const ProductController = ({ children, ignoreUnauthorized = false, requirePublished = false, useAuthorization = true }) => (
    <PendingProvider name="product">
        <ValidationContextProvider>
            <ControllerProvider>
                <PermissionsProvider autoLoadPermissions={!!useAuthorization}>
                    <ProductEffects
                        ignoreUnauthorized={ignoreUnauthorized}
                        requirePublished={requirePublished}
                        useAuthorization={!!useAuthorization}
                    />
                    {children || null}
                </PermissionsProvider>
            </ControllerProvider>
        </ValidationContextProvider>
    </PendingProvider>
)

export default ProductController
