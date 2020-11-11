// @flow

import { useContext, useMemo } from 'react'
import qs from 'query-string'

import { Context as RouterContext } from '$shared/contexts/Router'

function useNewProductMode() {
    const { location } = useContext(RouterContext)

    return useMemo(() => !!(qs.parse(location.search).newProduct || ''), [location])
}

export default useNewProductMode
