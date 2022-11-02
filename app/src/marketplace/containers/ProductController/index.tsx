import React, { useMemo, useEffect, useState, useReducer, useCallback, FunctionComponent, ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Provider as PendingProvider } from '$shared/contexts/Pending'
import { usePending } from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { Provider as PermissionsProvider } from './useProductPermissions'
import { Provider as ValidationContextProvider } from './ValidationContextProvider'
import useProductLoadCallback from './useProductLoadCallback'
import useContractProductLoadCallback from './useContractProductLoadCallback'
import useProductValidationEffect from './useProductValidationEffect'
import useLoadCategoriesCallback from './useLoadCategoriesCallback'
import useLoadProductStreamsCallback from './useLoadProductStreamsCallback'
import useDataUnionLoadCallback from './useDataUnionLoadCallback'
import useDataUnionStatsLoadCallback from './useDataUnionStatsLoadCallback'
import useRelatedProductsLoadCallback from './useRelatedProductsLoadCallback'
import useLoadAllStreamsCallback from './useLoadAllStreamsCallback'
import useResetDataUnionCallback from './useResetDataUnionCallback'
import useController, { ProductControllerContext } from './useController'
export { useController }

type UseProductLoadEffectParams = {ignoreUnauthorized: boolean, requirePublished: boolean, useAuthorization: boolean};
function useProductLoadEffect({ ignoreUnauthorized, requirePublished, useAuthorization }: UseProductLoadEffectParams) {
    const [loadedOnce, setLoadedOnce] = useState(false)
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
    const { isPending } = usePending('product.LOAD')
    const isMounted = useIsMounted()
    const { id: urlId } = useParams<{id: string}>()
    const { product } = useController()
    const chainId = product && getChainIdFromApiString(product.chain)
    useEffect(() => {
        if (urlId && !loadedOnce && !isPending) {
            // load product if needed and not already loading
            loadProduct({
                productId: urlId,
                ignoreUnauthorized,
                requirePublished,
                useAuthorization,
            })
            setLoadedOnce(true)
        }
    }, [urlId, loadedOnce, loadProduct, isPending, ignoreUnauthorized, useAuthorization, requirePublished, isMounted])
    useEffect(() => {
        if (urlId && chainId) {
            loadContractProduct(urlId, chainId)
        }
    }, [urlId, chainId, loadContractProduct])
}

function ProductEffects({ ignoreUnauthorized, requirePublished, useAuthorization }: UseProductLoadEffectParams): null {
    useProductLoadEffect({
        ignoreUnauthorized,
        requirePublished,
        useAuthorization,
    })
    useProductValidationEffect()
    return null
}

// TODO add typing
function reducer(state: any, action: {type: string} & Record<string, any>) {
    switch (action.type) {
        case 'setProduct':
            return { ...state, product: action.product, hasLoaded: true }

        case 'setProductStreams':
            return {
                ...state,
                productStreams: [...state.productStreams, ...action.streams],
            }

        case 'setAllStreams':
            return { ...state, allStreams: action.streams }

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
    // TODO add typing
    const setProduct = useCallback(
        (nextProduct: any) => {
            dispatch({
                type: 'setProduct',
                product: nextProduct,
            })
        },
        [dispatch],
    )
    // TODO add typing
    const setProductStreams = useCallback(
        (nextStreams: any) => {
            dispatch({
                type: 'setProductStreams',
                streams: nextStreams,
            })
        },
        [dispatch],
    )
    // TODO add typing
    const setAllStreams = useCallback(
        (nextStreams: any) => {
            dispatch({
                type: 'setAllStreams',
                streams: nextStreams,
            })
        },
        [dispatch],
    )
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
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
    return useMemo(
        () => ({
            hasLoaded,
            product,
            setProduct,
            productStreams,
            setProductStreams,
            allStreams,
            setAllStreams,
            loadProduct,
            loadContractProduct,
            loadCategories,
            loadProductStreams,
            loadDataUnion,
            loadDataUnionStats,
            loadRelatedProducts,
            loadAllStreams,
            resetDataUnion,
        }),
        [
            hasLoaded,
            product,
            setProduct,
            productStreams,
            setProductStreams,
            allStreams,
            setAllStreams,
            loadProduct,
            loadContractProduct,
            loadCategories,
            loadProductStreams,
            loadDataUnion,
            loadDataUnionStats,
            loadRelatedProducts,
            loadAllStreams,
            resetDataUnion,
        ],
    )
}

const ControllerProvider: FunctionComponent<{children?: ReactNode | ReactNode[]}> = ({ children }) =>{
    return (
        <ProductControllerContext.Provider value={useProductController()}>{children}</ProductControllerContext.Provider>
    )
}

const ProductController: FunctionComponent<{children?: ReactNode | ReactNode[]} & UseProductLoadEffectParams> = ({
    children,
    ignoreUnauthorized = false,
    requirePublished = false,
    useAuthorization = true,
}) => (
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
