// @flow

import { useCallback } from 'react'

// import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import type { Product } from '$mp/flowtype/product-types'
import useValidation from './useValidation'

export default function useCanvasLoadCallback() {
    // const { history } = useContext(RouterContext)
    const { setStatus: setNameStatus } = useValidation('name')

    return useCallback((product: Product) => {
        const p = product || {}

        setNameStatus(p.name ? 'ok' : 'no')
    }, [setNameStatus])
}
