import React, { useMemo, useContext, useEffect, useState, useReducer } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { usePending } from '$shared/hooks/usePending'
import { resetProduct } from '$mp/modules/product/actions'
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
import useClearStreamsCallback from './useClearStreamsCallback'
import useResetDataUnionCallback from './useResetDataUnionCallback'

const ProductControllerContext = React.createContext({})

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

    // Clear product on unmount
    const dispatch = useDispatch()
    useEffect(() => () => dispatch(resetProduct()), [dispatch])

    return null
}

export function useController() {
    return useContext(ProductControllerContext)
}

function useProductController() {
    const [{ hasLoaded, product }, setProduct] = useReducer((state, nextProduct) => ({
        product: nextProduct,
        hasLoaded: true,
    }), {
        hasLoaded: false,
        product: undefined,
    })
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
    const loadContractProductSubscription = useContractProductSubscriptionLoadCallback()
    const loadCategories = useLoadCategoriesCallback()
    const loadProductStreams = useLoadProductStreamsCallback()
    const loadDataUnion = useDataUnionLoadCallback()
    const loadDataUnionStats = useDataUnionStatsLoadCallback()
    const loadRelatedProducts = useRelatedProductsLoadCallback()
    const loadAllStreams = useLoadAllStreamsCallback()
    const clearStreams = useClearStreamsCallback()
    const resetDataUnion = useResetDataUnionCallback()

    return useMemo(() => ({
        product,
        hasLoaded,
        setProduct,
        loadProduct,
        loadContractProduct,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadDataUnionStats,
        loadRelatedProducts,
        loadAllStreams,
        clearStreams,
        resetDataUnion,
    }), [
        product,
        hasLoaded,
        setProduct,
        loadProduct,
        loadContractProduct,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadDataUnionStats,
        loadRelatedProducts,
        loadAllStreams,
        clearStreams,
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
            <PermissionsProvider autoLoadPermissions={!!useAuthorization}>
                <ControllerProvider>
                    <ProductEffects
                        ignoreUnauthorized={ignoreUnauthorized}
                        requirePublished={requirePublished}
                        useAuthorization={!!useAuthorization}
                    />
                    {children || null}
                </ControllerProvider>
            </PermissionsProvider>
        </ValidationContextProvider>
    </PendingProvider>
)

export default ProductController
