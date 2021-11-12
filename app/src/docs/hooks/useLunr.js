import { useMemo } from 'react'
import lunr from 'lunr'
import docsIndex from '../components/Search/index/index'
import store from '../components/Search/index/store'
import { runSearchQuery } from '../components/Search/searchUtils'

let index

export default function useLunr(query) {
    return useMemo(() => {
        if (index == null) {
            index = lunr.Index.load(docsIndex)
        }

        return runSearchQuery({
            query,
            index,
            store,
        })
    }, [query])
}
