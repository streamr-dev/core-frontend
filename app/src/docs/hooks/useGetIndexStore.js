import { useState, useEffect } from 'react'
import lunr from 'lunr'

import docsIndex from '../components/Search/index/index'
import docsStore from '../components/Search/index/store'
import { placeholderIndex } from '../components/Search/searchUtils'

const useGetIndexStore = () => {
    const [index, setIndex] = useState(placeholderIndex)
    const [store, setStore] = useState({})

    useEffect(() => {
        setIndex(lunr.Index.load(docsIndex))
        setStore(docsStore)
    }, [])
    return [index, store]
}

export default useGetIndexStore
