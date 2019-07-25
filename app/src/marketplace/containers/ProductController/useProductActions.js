// @flow

import { useMemo, useCallback, useContext } from 'react'

import { Context as UndoContext } from '$shared/components/UndoContextProvider'
import useProductUpdater from '../ProductController/useProductUpdater'

import type { Product } from '$mp/flowtype/product-types'

export function useProductActions() {
    const { updateProduct } = useProductUpdater()
    const { undo } = useContext(UndoContext)

    const updateName = useCallback((name: $ElementType<Product, 'name'>) => {
        updateProduct('Update name', (p) => ({
            ...p,
            name,
        }))
    }, [updateProduct])
    const updateDescription = useCallback((description: $ElementType<Product, 'description'>) => {
        updateProduct('Update description', (p) => ({
            ...p,
            description,
        }))
    }, [updateProduct])
    const updateImageUrl = useCallback((image: File | $ElementType<Product, 'imageUrl'>) => {
        updateProduct('Update image url', (p) => ({
            ...p,
            imageUrl: image,
        }))
    }, [updateProduct])

    return useMemo(() => ({
        undo,
        updateName,
        updateDescription,
        updateImageUrl,
    }), [undo, updateName, updateDescription, updateImageUrl])
}

export default useProductActions
