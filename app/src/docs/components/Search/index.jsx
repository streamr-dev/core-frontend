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

const SNIPPET_CHAR_LENGTH = 180
const CHARS_BEFORE_MATCH_LENGTH = 50
const CHARS_AFTER_MATCH_LENGTH = 130

const generateTextSnippet = (text, matchPosition, startHighlight, endHighlight) => {
    let textSnippet = text.slice(0, SNIPPET_CHAR_LENGTH)

    if (matchPosition < CHARS_BEFORE_MATCH_LENGTH && text.length > SNIPPET_CHAR_LENGTH) {
        textSnippet = `${text.slice(0, SNIPPET_CHAR_LENGTH - 3)}...` //  - 3 for 3 ...
    } else if (text.length > SNIPPET_CHAR_LENGTH) {
        const startChar = matchPosition - (CHARS_BEFORE_MATCH_LENGTH - 3) //  - 3 for 3 ...
        const endChar = matchPosition + (CHARS_AFTER_MATCH_LENGTH - 3) //  - 3 for 3 ...
        textSnippet = text.slice(startChar, endChar)
        textSnippet = `...${textSnippet}...`
    }

    textSnippet = [
        textSnippet.slice(0, endHighlight),
        '</span>',
        textSnippet.slice(endHighlight),
    ].join('')

    textSnippet = [
        textSnippet.slice(0, startHighlight),
        '<span class="highlight">',
        textSnippet.slice(startHighlight),
    ].join('')

    return textSnippet
}

const getHighlightCoords = (text, matchPosition, matchLength) => {
    let startHighlight = matchPosition
    let endHighlight = matchPosition + matchLength

    if (text.length > 180) {
        startHighlight = 50
        endHighlight = 50 + matchLength
    }

    return [startHighlight, endHighlight]
}

const formatSearchResults = (results: Object) => {
    if (!results.length) { return [] }

    return results.slice(0, 10).map((result) => {
        const { content, matchData } = result
        const [matchPosition, matchLength] = matchData
        const trimmedText = String(content).replace(/\n/g, ' ')

        const [startHighlight, endHighlight] = getHighlightCoords(trimmedText, matchPosition, matchLength)
        const textSnippet = generateTextSnippet(trimmedText, matchPosition, startHighlight, endHighlight)

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
