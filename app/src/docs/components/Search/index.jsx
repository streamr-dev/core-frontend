// @flow

import React, { useState, useCallback, useEffect } from 'react'
import lunr from 'lunr'
import { Link } from 'react-router-dom'
import { Translate, I18n } from 'react-redux-i18n'

import links from '$shared/../links'
import SvgIcon from '$shared/components/SvgIcon'

import SearchInput from '$mp/components/ActionBar/SearchInput'
import useLunr from '$docs/hooks/useLunr'
import RawHtml from '$shared/components/RawHtml'
import BodyClass from '$shared/components/BodyClass'

import styles from './search.pcss'

import docsIndex from './index/index'
import docsStore from './index/store'

const placeholderDoc = [{
    id: 0,
    name: '',
}]

const placeholderIndex = lunr(function generateIndex() {
    this.ref('id')
    this.field('name')
    this.metadataWhitelist = ['position']
    placeholderDoc.forEach(function populateIndex(doc) { this.add(doc) }, this)
})

type Props = {
    toggleOverlay: () => void,
}

const Search = ({ toggleOverlay }: Props) => {
    const [index, setIndex] = useState(placeholderIndex)
    const [query, setQuery] = useState('')
    const [overlayVisible, setOverlayVisible] = useState(true)
    const searchResults = useLunr(query, docsIndex, docsStore)

    useEffect(() => {
        setIndex(lunr.Index.load(index))
        setOverlayVisible(true)
    }, [index])

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
                        {searchResults.map((result, resultIndex) => (
                            resultIndex <= 10
                                ? (
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
                                    </li>)
                                : null
                        ))}
                        {!searchResults.length && (
                            <React.Fragment>
                                <p className={styles.noResults}>No results found for <strong>{query}</strong></p>
                                <p className={styles.noResultsMoreInfo}>
                                    Please try a different search or ask on our
                                    <a rel="noopener noreferrer" target="_blank" href={links.community.devForum}>Community Dev Forum</a>
                                    instead.
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
