// @flow

import { useState, useEffect, useMemo } from 'react'
import { runSearchQuery } from '../components/Search/searchUtils'

const useLunr = (query: string, providedIndex: any, providedStore: any) => {
    const [index, setIndex] = useState(null)
    const [store, setStore] = useState(null)

    useEffect(() => {
        if (!providedIndex || !providedStore) { return }
        setIndex(providedIndex)
        setStore(providedStore)
    }, [providedIndex, providedStore])

    return useMemo(() => runSearchQuery({
        query, index, store,
    }), [query, store, index])
}

export default useLunr
