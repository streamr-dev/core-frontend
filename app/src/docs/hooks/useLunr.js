// @flow

import { useState, useEffect, useMemo } from 'react'
import lunr from 'lunr'

const formatMatchData = (matchData) => {
    // NEXT: Extract the highlight position and length.
    // matchData keys are the keyword matches,
    // number of characters into the string, where the match is.
    // Only look at the first matching word for now.
    let matchPosition = 0
    let matchLength = 0

    Object.values(matchData).forEach((match: Object, matchIndex: number) => {
        if (matchIndex === 0) {
            const matches = Object.values(match)
            matches.forEach(({ content }: Object, contentIndex) => {
                const { position } = content
                if (contentIndex === 0 && content && position) {
                    [[matchPosition, matchLength]] = position
                }
            })
        }
    })

    return [matchPosition, matchLength]
}

const useLunr = (query: string, providedIndex: any, providedStore: any) => {
    const [index, setIndex] = useState(null)
    const [store, setStore] = useState(null)

    useEffect(() => {
        if (!providedIndex) { return }
        setIndex(providedIndex)
    }, [providedIndex])

    useEffect(() => {
        if (!providedStore) { return }
        setStore(providedStore)
    }, [providedStore])

    return useMemo(() => {
        if (!query || !index || !store) { return [] }

        // 'trimmer' causes unexplainable crashes while searching.
        lunr(function removeTrimmer() {
            this.pipeline.remove(lunr.trimmer)
        })

        const lunrResults = () => (
            // Search on the 'content' field of the array only.
            // Store is built with the title as the first sentence of the 'content' field.
            // Exact matches get a boost. Trailing wildcard (type-ahead) matches get a lower score.
            index.query((q) => {
                q.term(lunr.tokenizer(query), {
                    fields: ['content'],
                    boost: 100,
                    usePipeline: false,
                })
                q.term(lunr.tokenizer(query), {
                    fields: ['content'],
                    boost: 10,
                    usePipeline: false,
                    wildcard: lunr.Query.wildcard.TRAILING,
                })
            })
        )

        const results = lunrResults().map(({ ref, matchData }) => {
            // The results are generated from the combination of combining the index with the store.
            // matchData contains the position indexes of the matched keywords
            const searchResults = store[ref]
            searchResults.matchData = formatMatchData(matchData)
            return searchResults
        })

        return results
    }, [query, index, store])
}

export default useLunr
