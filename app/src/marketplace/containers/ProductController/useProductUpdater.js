import { useMemo, useContext } from 'react'

import useMountedCallback from '$shared/utils/useMountedCallback'
import { Context as UndoContext } from '$shared/components/UndoContextProvider'

function productUpdater(fn) {
    return (product) => {
        const nextProduct = fn(product)
        if (nextProduct === null || nextProduct === product) { return product }
        return {
            ...nextProduct,
        }
    }
}

export default function useProductUpdater() {
    const { push, replace } = useContext(UndoContext)

    const updateProduct = useMountedCallback((action, fn, done) => {
        push(action, productUpdater(fn), done)
    }, [push, productUpdater])

    const replaceProduct = useMountedCallback((fn, done) => {
        replace(productUpdater(fn), done)
    }, [push, productUpdater])

    return useMemo(() => ({
        updateProduct,
        replaceProduct,
    }), [updateProduct, replaceProduct])
}
