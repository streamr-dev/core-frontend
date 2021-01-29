// @flow

import React, { useState, type Node } from 'react'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import useLunr from '$docs/hooks/useLunr'
import useGetIndexStore from '$docs/hooks/useGetIndexStore'
import RawHtml from '$shared/components/RawHtml'
import BodyClass from '$shared/components/BodyClass'
import { SM, LG } from '$shared/utils/styled'
import routes from '$routes'
import { formatSearchResults } from './searchUtils'
import SearchInput from './SearchInput'

const SearchResults = styled.div`
`

const SearchResultsInner = styled.div`
    margin: 0 auto;
    max-width: 1080px;
    padding: 0 1.5rem;

    > * {
        text-align: left;
        list-style: none;
        margin: 1.5rem 0 10rem;
        padding: 0;
    }

    li {
        margin-bottom: 1.5rem;
        max-width: 700px;

        .searchResultSnippet {
            padding: 0;
            margin: 0;
            font-size: 16px;
            line-height: 28px;
        }
    }

    .highlight {
        background-color: #E5E9FF;
        padding: 1px 2px;
        font-weight: var(--medium);
    }

    @media (min-width: ${SM}px) {
        padding: 0 3rem;
    }

    @media (min-width: ${LG}px) {
        padding: 0 1.5rem;
    }
`

const ResultHeading = styled(Link)`
    color: var(--streamrBlue);
    font-weight: var(--medium);
    font-size: 16px;
    line-height: 28px;
`

const ResultSection = styled.span`
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #A3A3A3;
    font-size: 12px;
`

const NoResultsText = styled(Translate)`
    color: rgb(50, 50, 50);
    font-family: var(--sans);
    letter-spacing: 0;
    line-height: 28px;
    font-size: 16px;
    margin-bottom: 0.5rem;

    @media (min-width: ${LG}px) {
        font-size: 24px;
        margin-bottom: 0;
    }
`

const MoreInfoText = styled(Translate)`
    color: rgb(50, 50, 50);
    font-family: var(--sans);
    letter-spacing: 0;
    font-size: 12px;
    line-height: 18px;

    br {
        display: block;
    }

    @media (min-width: ${LG}px) {
        line-height: 28px;
        font-size: 16px;

        br {
            display: none;
        }
    }
`

const TopWrapper = styled.div`
    background: white;
`

type Props = {
    nav?: Node,
    toggleOverlay: () => void,
}

const UnstyledSearch = ({ toggleOverlay, nav, ...props }: Props) => {
    const [index, store] = useGetIndexStore()
    const [query, setQuery] = useState('')
    const searchResults = useLunr(query, index, store)

    const onSearchChange = (searchValue) => {
        setQuery(searchValue)
    }

    const resultClick = () => {
        toggleOverlay()
    }

    const closeOverlay = () => {
        toggleOverlay()
    }

    return (
        <div {...props}>
            <BodyClass className="overflow-hidden" />
            <TopWrapper>
                {nav}
                <SearchInput
                    value={query}
                    onChange={onSearchChange}
                    onClose={closeOverlay}
                />
            </TopWrapper>
            <SearchResults>
                <SearchResultsInner>
                    <ul>
                        {formatSearchResults(searchResults).map((result) => (
                            <li key={result.id}>
                                <ResultHeading onClick={resultClick} to={result.id}>
                                    {result.title}
                                </ResultHeading>
                                <RawHtml>
                                    {result.textSnippet}
                                </RawHtml>
                                <ResultSection>
                                    {result.section}
                                </ResultSection>
                            </li>
                        ))}
                        {!searchResults.length && !!query.length && (
                            <React.Fragment>
                                <NoResultsText
                                    value="docs.search.noResultsFoundFor"
                                    query={query}
                                    tag="p"
                                    dangerousHTML
                                />
                                <MoreInfoText
                                    value="docs.search.noResults"
                                    tag="p"
                                    url={routes.community.devForum()}
                                    dangerousHTML
                                />
                            </React.Fragment>
                        )}
                    </ul>
                </SearchResultsInner>
            </SearchResults>
        </div>
    )
}

const Search = styled(UnstyledSearch)`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1003;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    background-color: rgba(255, 255, 255, 0.97);

    ${TopWrapper} {
        position: sticky;
        top: 0px;
    }

    ${SearchResults} {
        flex-grow: 1;
    }
`

export default Search
