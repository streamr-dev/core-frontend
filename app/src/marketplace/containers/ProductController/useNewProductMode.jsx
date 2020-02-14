// @flow

import { useContext, useMemo } from 'react'
import qs from 'query-string'

import { Context as RouterContext } from '$shared/contexts/Router'

function useNewProductMode() {
    const { location } = useContext(RouterContext)
    const isNewProduct = !!(qs.parse(location.search).newProduct || '')

    return useMemo(() => ({
        isNewProduct,
    }), [isNewProduct])
}

export default useNewProductMode
