// @flow

import React, { type Node, useContext, useEffect } from 'react'

import * as RouterContext from '$shared/components/RouterContextProvider'
import { Provider as PendingProvider } from '$shared/components/PendingContextProvider'
import { usePending } from '$shared/hooks/usePending'
import LoadingIndicator from '$userpages/components/LoadingIndicator'

import useProduct from './useProduct'
import useProductLoadCallback from './useProductLoadCallback'

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

    return null
}

function ProductLoadingIndicator() {
    const { isPending } = usePending('product.LOAD')
    return (
        <LoadingIndicator loading={isPending} />
    )
}

type ControllerProps = {
    children?: Node,
}

const ProductController = ({ children }: ControllerProps) => (
    <RouterContext.Provider>
        <PendingProvider>
            <ProductLoadingIndicator />
            <ProductEffects />
            {children || null}
        </PendingProvider>
    </RouterContext.Provider>
)

export default ProductController
