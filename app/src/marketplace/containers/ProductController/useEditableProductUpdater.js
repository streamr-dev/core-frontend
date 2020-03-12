import { useMemo, useContext } from 'react'

import useOnlyIfMountedCallback from '$shared/hooks/useOnlyIfMountedCallback'
import { Context as UndoContext } from '$shared/contexts/Undo'

function productUpdater(fn) {
    return (product) => {
        const nextProduct = fn(product)
        if (nextProduct === null || nextProduct === product) { return product }
        return {
            ...nextProduct,
        }
    }
}

export default function useEditableProductUpdater() {
    const { push, replace } = useContext(UndoContext)

    const updateProduct = useOnlyIfMountedCallback((action, fn, done) => {
        push(action, productUpdater(fn), done)
    }, [push, productUpdater])

    const replaceProduct = useOnlyIfMountedCallback((fn, done) => {
        replace(productUpdater(fn), done)
    }, [push, productUpdater])

    return useMemo(() => ({
        updateProduct,
        replaceProduct,
    }), [updateProduct, replaceProduct])
}
