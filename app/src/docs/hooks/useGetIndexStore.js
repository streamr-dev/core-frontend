import { useState, useEffect } from 'react'
import lunr from 'lunr'

import docsIndex from '../components/Search/index/index'
import docsStore from '../components/Search/index/store'

const placeholderDoc = [{
    id: 0,
    content: '',
}]

const placeholderIndex = lunr(function generatePlaceholderIndex() {
    this.ref('id')
    this.field('content')
    placeholderDoc.forEach(function addDoc(doc) { this.add(doc) }, this)
})

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
