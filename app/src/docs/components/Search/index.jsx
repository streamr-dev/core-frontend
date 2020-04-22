// @flow

import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

import links from '$shared/../links'
import SvgIcon from '$shared/components/SvgIcon'

import SearchInput from '$mp/components/ActionBar/SearchInput'
import useLunr from '$docs/hooks/useLunr'
import useGetIndexStore from '$docs/hooks/useGetIndexStore'
import RawHtml from '$shared/components/RawHtml'
import BodyClass from '$shared/components/BodyClass'

import styles from './search.pcss'

type Props = {
    toggleOverlay: () => void,
}

const SNIPPET_CHARS = 210
const MIN_MATCH_BUFFER_CHARS = 50
const CHARS_AFTER_MATCH = SNIPPET_CHARS - MIN_MATCH_BUFFER_CHARS

const generateTextSnippet = (text, matchPosition) => {
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

const formatSearchResults = (results: Object) => {
    if (!results.length) { return [] }

    return results.slice(0, 10).map((result) => {
        const { content: fullText, matchData } = result
        const [matchPosition, matchLength] = matchData

        const highlightedFullText = highlightMatch(fullText, matchPosition, matchPosition + matchLength).replace(/\n/g, ' ')
        const textSnippet = generateTextSnippet(highlightedFullText, matchPosition)

        return {
            ...result,
            textSnippet,
        }
    })
}

const Search = ({ toggleOverlay }: Props) => {
    const [index, store] = useGetIndexStore()
    const [query, setQuery] = useState('')
    const [overlayVisible, setOverlayVisible] = useState(true)
    const searchResults = useLunr(query, index, store)

    const onSearchChange = (searchValue) => {
        setQuery(searchValue)
    }

    const resultClick = () => {
        setOverlayVisible(false)
    }

    const closeOverlay = () => {
        setOverlayVisible(false)
        toggleOverlay()
    }

    const onKeyDown = useCallback((event) => {
        if (event.key === 'Escape') {
            setOverlayVisible(false)
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])

    return (overlayVisible
        ? (
            <div
                className={styles.searchOverlay}
            >
                <BodyClass className={overlayVisible && 'overflow-hidden'} />
                <div className={styles.searchContainer}>
                    <SearchInput
                        value={query}
                        onChange={onSearchChange}
                        placeholder="Search"
                        className={styles.docsSearchInput}
                        hideClearButton
                        autoFocus
                    />
                    <button
                        type="button"
                        className={styles.exitButton}
                        onClick={closeOverlay}
                    >
                        <SvgIcon name="cross" />
                    </button>
                </div>
                <div className={styles.searchResults}>
                    <ul>
                        {formatSearchResults(searchResults).map((result) => (
                            <li key={result.id}>
                                <Link onClick={resultClick} className={styles.resultHeading} to={result.id}>
                                    {result.title}
                                </Link>
                                <RawHtml className={styles.searchResultSnippet}>
                                    {result.textSnippet}
                                </RawHtml>
                                <span className={styles.resultSection}>
                                    {result.section}
                                </span>
                            </li>
                        ))}
                        {!searchResults.length && !!query.length && (
                            <React.Fragment>
                                <p className={styles.noResults}>
                                    <Translate value="docs.search.noResultsFoundFor" tag="span" />
                                    <strong> {query}</strong>
                                </p>
                                <p className={styles.noResultsMoreInfo}>
                                    <Translate value="docs.search.noResults" tag="span" />
                                    <br className={styles.mobileOnlyBreak} />
                                    <a rel="noopener noreferrer" target="_blank" href={links.community.devForum}> Community Dev Forum </a>
                                    <Translate value="docs.search.noResultsSuffix" />
                                </p>
                            </React.Fragment>
                        )
                        }
                    </ul>
                </div>
            </div>)
        : null
    )
}

export default Search
