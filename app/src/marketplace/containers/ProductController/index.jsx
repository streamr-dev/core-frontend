// @flow

import React, { type Node, type Context, useMemo, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import * as RouterContext from '$shared/contexts/Router'
import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { Provider as ValidationContextProvider } from './ValidationContextProvider'
import { Provider as PermissionsProvider } from './useProductPermissions'
import { usePending } from '$shared/hooks/usePending'
import { resetProduct } from '$mp/modules/product/actions'

import useProductLoadCallback from './useProductLoadCallback'
import useContractProductLoadCallback from './useContractProductLoadCallback'
import useProductValidationEffect from './useProductValidationEffect'
import useContractProductSubscriptionLoadCallback from './useContractProductSubscriptionLoadCallback'
import useLoadCategoriesCallback from './useLoadCategoriesCallback'
import useLoadProductStreamsCallback from './useLoadProductStreamsCallback'
import useDataUnionLoadCallback from './useDataUnionLoadCallback'
import useDataUnionStatsLoadCallback from './useDataUnionStatsLoadCallback'
import useRelatedProductsLoadCallback from './useRelatedProductsLoadCallback'
import useLoadStreamsCallback from './useLoadStreamsCallback'
import useClearStreamsCallback from './useClearStreamsCallback'

type ContextProps = {
    loadProduct: Function,
    loadContractProduct: Function,
    loadContractProductSubscription: Function,
    loadCategories: Function,
    loadProductStreams: Function,
    loadDataUnion: Function,
    loadDataUnionStats: Function,
    loadRelatedProducts: Function,
    loadStreams: Function,
    clearStreams: Function,
}

const ProductControllerContext: Context<ContextProps> = React.createContext({})

function useProductLoadEffect() {
    const [loadedOnce, setLoadedOnce] = useState(false)
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('product.LOAD')

    const { id: urlId } = match.params

    useEffect(() => {
        if (urlId && !loadedOnce && !isPending) {
            // load product if needed and not already loading
            loadProduct(urlId)
            loadContractProduct(urlId)
            setLoadedOnce(true)
        }
    }, [urlId, loadedOnce, loadProduct, loadContractProduct, isPending])
}

function ProductEffects() {
    useProductLoadEffect()
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
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
    const loadContractProductSubscription = useContractProductSubscriptionLoadCallback()
    const loadCategories = useLoadCategoriesCallback()
    const loadProductStreams = useLoadProductStreamsCallback()
    const loadDataUnion = useDataUnionLoadCallback()
    const loadDataUnionStats = useDataUnionStatsLoadCallback()
    const loadRelatedProducts = useRelatedProductsLoadCallback()
    const loadStreams = useLoadStreamsCallback()
    const clearStreams = useClearStreamsCallback()

    return useMemo(() => ({
        loadProduct,
        loadContractProduct,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadDataUnionStats,
        loadRelatedProducts,
        loadStreams,
        clearStreams,
    }), [
        loadProduct,
        loadContractProduct,
        loadContractProductSubscription,
        loadCategories,
        loadProductStreams,
        loadDataUnion,
        loadDataUnionStats,
        loadRelatedProducts,
        loadStreams,
        clearStreams,
    ])
}

type ControllerProps = {
    children?: Node,
}

function ControllerProvider({ children }: ControllerProps) {
    return (
        <ProductControllerContext.Provider value={useProductController()}>
            {children}
        </ProductControllerContext.Provider>
    )
}

const ProductController = ({ children }: ControllerProps) => (
    <RouterContext.Provider>
        <PendingProvider name="product">
            <ValidationContextProvider>
                <PermissionsProvider>
                    <ControllerProvider>
                        <ProductEffects />
                        {children || null}
                    </ControllerProvider>
                </PermissionsProvider>
            </ValidationContextProvider>
        </PendingProvider>
    </RouterContext.Provider>
)

export default ProductController
