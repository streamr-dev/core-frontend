import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'

const getFirstElement = (value: string | string[]): string => {
    if (typeof value === "string") {
        return value
    } else {
        return value[0]
    }
}

function useNewProductMode() {
    const location = useLocation()
    return useMemo(() => {
        const query = qs.parse(location.search)
        return {
            isNew: !!(query.newProduct || ''),
            dataUnionAddress: getFirstElement(query.dataUnionAddress || ''),
            chainId: query.chainId ? Number.parseInt(getFirstElement(query.chainId || '')) : 0,
        }
    }, [location])
}

export default useNewProductMode
