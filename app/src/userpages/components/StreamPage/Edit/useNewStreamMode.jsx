// @flow

import { useMemo } from 'react'
import qs from 'query-string'
import { useLocation } from 'react-router-dom'

function useNewStreamMode() {
    const location = useLocation()

    return useMemo(() => !!(qs.parse(location.search).newStream || ''), [location])
}

export default useNewStreamMode
