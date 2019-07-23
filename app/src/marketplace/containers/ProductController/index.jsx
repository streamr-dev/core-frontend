// @flow

import React, { type Node, useContext, useEffect } from 'react'

import * as RouterContext from '$shared/components/RouterContextProvider'
import { Provider as PendingProvider } from '$shared/components/PendingContextProvider'
import { usePending } from '$shared/hooks/usePending'

import useProduct from './useProduct'
import useProductLoadCallback from './useProductLoadCallback'

function useProductLoadEffect() {
    const product = useProduct()
    const load = useProductLoadCallback()
    const { match } = useContext(RouterContext.Context)
    const { isPending } = usePending('product.LOAD')

    const { id: urlId } = match.params
    const productId = (product && product.id) || urlId

    useEffect(() => {
        if (!urlId) { return } // do nothing if no url id
        if (productId && !isPending) {
            // load canvas if needed and not already loading
            load(productId)
        }
    }, [urlId, productId, load, product, isPending])
}

function ProductEffects() {
    useProductLoadEffect()

    return null
}

type ControllerProps = {
    children?: Node,
}

const ProductController = ({ children }: ControllerProps) => (
    <RouterContext.Provider>
        <PendingProvider>
            <ProductEffects />
            {children || null}
        </PendingProvider>
    </RouterContext.Provider>
)

export default ProductController
