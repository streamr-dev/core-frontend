// @flow

import React, { type Node, useContext, useEffect } from 'react'

import * as RouterContext from '$shared/components/RouterContextProvider'
import { Provider as PendingProvider } from '$shared/components/PendingContextProvider'
import { Provider as ValidationContextProvider } from './ValidationContextProvider'
import { usePending } from '$shared/hooks/usePending'

import useProduct from './useProduct'
import useProductLoadCallback from './useProductLoadCallback'
import useProductValidationEffect from './useProductValidationEffect'

function useProductLoadEffect() {
    const product = useProduct()
    const load = useProductLoadCallback()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('product.LOAD')

    const { id: urlId } = match.params
    const productId = product && product.id

    useEffect(() => {
        if (urlId && productId !== urlId && !isPending) {
            // load canvas if needed and not already loading
            load(urlId)
        }
    }, [urlId, productId, load, isPending])
}

function ProductEffects() {
    useProductLoadEffect()
    useProductValidationEffect()

    return null
}

type ControllerProps = {
    children?: Node,
}

const ProductController = ({ children }: ControllerProps) => (
    <RouterContext.Provider>
        <PendingProvider>
            <ValidationContextProvider>
                <ProductEffects />
                {children || null}
            </ValidationContextProvider>
        </PendingProvider>
    </RouterContext.Provider>
)

export default ProductController
