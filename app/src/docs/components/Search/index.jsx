// @flow

import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'

import SvgIcon from '$shared/components/SvgIcon'

import SearchInput from '$mp/components/ActionBar/SearchInput'
import useLunr from '$docs/hooks/useLunr'
import useGetIndexStore from '$docs/hooks/useGetIndexStore'
import RawHtml from '$shared/components/RawHtml'
import BodyClass from '$shared/components/BodyClass'
import routes from '$routes'
import { formatSearchResults } from './searchUtils'

import styles from './search.pcss'

type Props = {
    toggleOverlay: () => void,
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
        toggleOverlay()
    }

    const closeOverlay = () => {
        setOverlayVisible(false)
        toggleOverlay()
    }

    const onKeyDown = useCallback((event) => {
        if (event.key === 'Escape') {
            setOverlayVisible(false)
            toggleOverlay()
        }
    }, [toggleOverlay])

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
                                <Translate
                                    value="docs.search.noResultsFoundFor"
                                    query={query}
                                    className={styles.noResults}
                                    tag="p"
                                    dangerousHTML
                                />
                                <Translate
                                    value="docs.search.noResults"
                                    tag="p"
                                    className={styles.noResultsMoreInfo}
                                    url={routes.community.devForum()}
                                    dangerousHTML
                                />
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
