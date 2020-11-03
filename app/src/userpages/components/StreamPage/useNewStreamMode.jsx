// @flow

import { useMemo } from 'react'
import qs from 'query-string'
import { useLocation } from 'react-router-dom'

function useNewStreamMode() {
    const location = useLocation()
    const isNewStream = !!(qs.parse(location.search).newStream || '')

    return useMemo(() => ({
        isNewStream,
    }), [isNewStream])
}

export default useNewStreamMode
