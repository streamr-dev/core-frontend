// @flow

import lunr from 'lunr'

const SNIPPET_CHARS = 210
const MIN_MATCH_BUFFER_CHARS = 50
const CHARS_AFTER_MATCH = SNIPPET_CHARS - MIN_MATCH_BUFFER_CHARS

const trimTextToSnippet = (text, matchPosition) => {
    // A) No trimming
    if (text.length < SNIPPET_CHARS) {
        return text
    }

    // A) Trim end
    if (matchPosition < MIN_MATCH_BUFFER_CHARS) {
        return `${text.slice(0, SNIPPET_CHARS - 3)}...` //  - 3 for 3 ...
    }

    // A) Trim start & end
    const startChar = matchPosition - (MIN_MATCH_BUFFER_CHARS - 3) //  - 3 for 3 ...
    const endChar = matchPosition + (CHARS_AFTER_MATCH - 3) //  - 3 for 3 ...
    return `...${text.slice(startChar, endChar)}...`
}

const highlightMatch = (text, startHighlightChar, endHighlightChar) => {
    let textWithHighlight = text

    textWithHighlight = [
        text.slice(0, endHighlightChar),
        '</span>',
        text.slice(endHighlightChar),
    ].join('')

    textWithHighlight = [
        textWithHighlight.slice(0, startHighlightChar),
        '<span class="highlight">',
        textWithHighlight.slice(startHighlightChar),
    ].join('')

    return textWithHighlight
}

export const formatSearchResults = (results: Object) => {
    if (!results.length) { return [] }

    return results.slice(0, 10).map((result) => {
        const { content: fullText, matchData } = result
        const [matchPosition, matchLength] = matchData

        const highlightedFullText = highlightMatch(fullText, matchPosition, matchPosition + matchLength).replace(/\n/g, ' ')
        const textSnippet = trimTextToSnippet(highlightedFullText, matchPosition)

        return {
            ...result,
            textSnippet,
        }
    })
}

const formatSearchMatchData = (matchData) => {
    // matchPosition: The number of characters into the string where the match is located.
    // matchLength: The number of characters of the keyword matched.
    let matchPosition = 0
    let matchLength = 0

    Object.values(matchData).forEach((match: Object, matchIndex: number) => {
        // highlighting first match only (for now)
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

export const runSearchQuery = ({ query, index, store }: any) => {
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
                usePipeline: true,
            })
            q.term(lunr.tokenizer(query), {
                fields: ['content'],
                boost: 10,
                usePipeline: true,
                wildcard: lunr.Query.wildcard.TRAILING,
            })
        })
    )

    const results = lunrResults().map(({ ref, matchData }) => {
        // The results are generated from the combination of combining the index with the store.
        // matchData contains the position indexes of the matched keywords
        const searchResults = store[ref]
        searchResults.matchData = formatSearchMatchData(matchData)
        return searchResults
    })

    return results
}
