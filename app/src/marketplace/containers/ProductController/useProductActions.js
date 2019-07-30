// @flow

import { useMemo, useCallback, useContext } from 'react'

import { Context as UndoContext } from '$shared/components/UndoContextProvider'
import useProductUpdater from '../ProductController/useProductUpdater'

import type { Product } from '$mp/flowtype/product-types'
import type { StreamIdList } from '$shared/flowtype/stream-types'
import type { NumberString } from '$shared/flowtype/common-types'

export function useProductActions() {
    const { updateProduct: commit } = useProductUpdater()
    const { undo } = useContext(UndoContext)

    const updateProduct = useCallback((product: Object, msg: string = 'Update product') => {
        commit(msg, (p) => ({
            ...p,
            ...product,
        }))
    }, [commit])
    const updateName = useCallback((name: $ElementType<Product, 'name'>) => {
        commit('Update name', (p) => ({
            ...p,
            name,
        }))
    }, [commit])
    const updateDescription = useCallback((description: $ElementType<Product, 'description'>) => {
        commit('Update description', (p) => ({
            ...p,
            description,
        }))
    }, [commit])
    const updateImageUrl = useCallback((image: File | $ElementType<Product, 'imageUrl'>) => {
        commit('Update image url', (p) => ({
            ...p,
            imageUrl: image,
        }))
    }, [commit])
    const updateStreams = useCallback((streams: StreamIdList) => {
        commit('Update streams', (p) => ({
            ...p,
            streams,
        }))
    }, [commit])
    const updateCategory = useCallback((category: $ElementType<Product, 'category'>) => {
        commit('Update category', (p) => ({
            ...p,
            category,
        }))
    }, [commit])
    const updateAdminFee = useCallback((adminFee: number) => {
        commit('Update admin fee', (p) => ({
            ...p,
            adminFee,
        }))
    }, [commit])
    const updatePricePerSecond = useCallback((pricePerSecond: NumberString) => {
        commit('Update price per second', (p) => ({
            ...p,
            pricePerSecond,
        }))
    }, [commit])

    return useMemo(() => ({
        undo,
        updateProduct,
        updateName,
        updateDescription,
        updateImageUrl,
        updateStreams,
        updateCategory,
        updateAdminFee,
        updatePricePerSecond,
    }), [
        undo,
        updateProduct,
        updateName,
        updateDescription,
        updateImageUrl,
        updateStreams,
        updateCategory,
        updateAdminFee,
        updatePricePerSecond,
    ])
}

export default useProductActions
