// @flow

import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'

function useNewProductMode() {
    const location = useLocation()

    return useMemo(() => !!(qs.parse(location.search).newProduct || ''), [location])
}

export default useNewProductMode
