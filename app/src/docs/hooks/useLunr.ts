import { useMemo } from 'react'
import lunr, { Index } from 'lunr'
import docsIndex from '../components/Search/index/index.json'
import store from '../components/Search/index/store.json'
import { runSearchQuery } from '../components/Search/searchUtils'
let index: Index
export default function useLunr(query: string) {
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
