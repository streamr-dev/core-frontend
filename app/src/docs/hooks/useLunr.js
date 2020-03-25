// @flow

import { useState, useEffect, useMemo } from 'react'
import lunr from 'lunr'

const InvalidIndexError = Error('Lunr index could not be parsed. Check that your index exists and is valid.')
const InvalidStoreError = Error('Lunr store could not be parsed. Check that your store exists and is valid.')

const useLunr = (query: string, providedIndex: any, providedStore: any) => {
    const [index, setIndex] = useState(null)
    const [store, setStore] = useState(null)

    useEffect(() => {
        const processedIndex =
            typeof providedIndex === 'string'
                ? lunr.Index.load(JSON.parse(providedIndex))
                : providedIndex

        if (!processedIndex) {
            throw InvalidIndexError
        }

        setIndex(processedIndex)
    }, [providedIndex])

    useEffect(() => {
        const processedStore =
            typeof providedStore === 'string'
                ? JSON.parse(providedStore)
                : providedStore

        if (!processedStore) {
            throw InvalidStoreError
        }

        setStore(processedStore)
    }, [providedStore])

    return useMemo(() => {
        if (!query || !index || !store) { return [] }

        // removeTrimmer fixes some unexpected crashes while searching
        lunr(function () {
            this.pipeline.remove(lunr.trimmer)
        })

        const lunrResults = () =>
            index.query((q) => {
                q.term(lunr.tokenizer(query), {
                    fields: ['content'],
                    boost: 100,
                    usePipeline: true,
                })
                q.term(lunr.tokenizer(query), {
                    fields: ['content'],
                    boost: 10,
                    usePipeline: false,
                    wildcard: lunr.Query.wildcard.TRAILING,
                })
            })
        // TODO: Tidy this up, move it to its own function
        const searchResults = lunrResults().map(({ ref, matchData }) => {
            const res = store[ref]
            res.matchData = matchData
            const fullContent = String(res.content).replace(/\n/g, ' ')
            // matchData is an object
            // keys are the keyword matches,

            // number of characters into the string, where the match is.
            // Only look at the first matching word for now.
            const matchPosition = []
            const matchLength = []
            Object.values(matchData).forEach((match, matchIndex) => {
                if (matchIndex === 0) {
                    // $FlowFixMe
                    Object.values(match).forEach(({ content }, contentIndex) => {
                        // $FlowFixMe
                        if (contentIndex === 0 && content && content.position) {
                            // $FlowFixMe
                            matchPosition.push(content.position[0][0])
                            matchLength.push(content.position[0][1])
                        }
                    })
                }
            })

            let textSnippet = ''
            let startHighlightPosition = matchPosition[0]
            let endHighlightPosition = matchPosition[0] + matchLength[0]

            if (matchPosition[0] < 50 && fullContent.length < 180) {
                textSnippet = fullContent.slice(0, fullContent.length)
            } else if (matchPosition[0] < 50 && fullContent.length > 180) {
                textSnippet = `${fullContent.slice(0, 177)}...`
            } else if (fullContent.length > 180) {
                // start 50 characters earlier than the match
                const startChar = matchPosition[0] - 47 // 3 diff for 3 dots
                const endChar = matchPosition[0] + 127
                startHighlightPosition = 50
                endHighlightPosition = 50 + matchLength[0]
                textSnippet = fullContent.slice(startChar, endChar)
                textSnippet = `...${textSnippet}...`
            } else {
                textSnippet = fullContent
            }

            const startHighlightHtml = '<span class="highlight">'
            const endHighlightHtml = '</span>'
            textSnippet = [textSnippet.slice(0, endHighlightPosition), endHighlightHtml, textSnippet.slice(endHighlightPosition)].join('')
            textSnippet = [textSnippet.slice(0, startHighlightPosition), startHighlightHtml, textSnippet.slice(startHighlightPosition)].join('')
            res.textSnippet = textSnippet

            return res
        })
        return searchResults
    }, [query, index, store])
}

export default useLunr
