// @flow

import React, { type Node, type Context, useMemo, useContext, useEffect } from 'react'

import * as RouterContext from '$shared/components/RouterContextProvider'
import { Provider as PendingProvider } from '$shared/components/PendingContextProvider'
import { Provider as ValidationContextProvider } from './ValidationContextProvider'
import { usePending } from '$shared/hooks/usePending'

import useEditableProduct from './useEditableProduct'
import useProductLoadCallback from './useProductLoadCallback'
import useContractProductLoadCallback from './useContractProductLoadCallback'
import useProductValidationEffect from './useProductValidationEffect'

type ContextProps = {
    loadProduct: Function,
    loadContractProduct: Function,
}

const ProductControllerContext: Context<ContextProps> = React.createContext({})

function useProductLoadEffect() {
    const product = useEditableProduct()
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('product.LOAD')

    const { id: urlId } = match.params
    const productId = product && product.id

    useEffect(() => {
        if (urlId && productId !== urlId && !isPending) {
            // load product if needed and not already loading
            loadProduct(urlId)
            loadContractProduct(urlId)
        }
    }, [urlId, productId, loadProduct, loadContractProduct, isPending])
}

function ProductEffects() {
    useProductLoadEffect()
    useProductValidationEffect()

    return null
}

export function useController() {
    return useContext(ProductControllerContext)
}

function useProductController() {
    const loadProduct = useProductLoadCallback()
    const loadContractProduct = useContractProductLoadCallback()

    return useMemo(() => ({
        loadProduct,
        loadContractProduct,
    }), [loadProduct, loadContractProduct])
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
                <ControllerProvider>
                    <ProductEffects />
                    {children || null}
                </ControllerProvider>
            </ValidationContextProvider>
        </PendingProvider>
    </RouterContext.Provider>
)

export default ProductController
