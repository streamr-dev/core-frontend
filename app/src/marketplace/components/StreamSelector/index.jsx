// @flow

import React, { useState, useMemo, useCallback, useEffect } from 'react'

import classNames from 'classnames'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import { Input } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import DropdownActions from '$shared/components/DropdownActions'
import SvgIcon from '$shared/components/SvgIcon'
import Errors from '$ui/Errors'
import LoadingIndicator from '$userpages/components/LoadingIndicator'
import Spinner from '$shared/components/Spinner'

import links from '$mp/../links'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'
import useInfiniteScroll from '$shared/hooks/useInfiniteScroll'
import { useDebounced } from '$shared/hooks/wrapCallback'

import type { Stream, StreamList, StreamIdList, StreamId } from '$shared/flowtype/stream-types'

import styles from './streamSelector.pcss'

type Props = LastErrorProps & {
    fetchingStreams?: boolean,
    streams: StreamIdList,
    availableStreams: StreamList,
    className?: string,
    onEdit: (StreamIdList) => void,
    disabled?: boolean,
    onSearch?: (string) => void,
    hasMoreResults?: boolean,
    onLoadMore?: Function,
}

const SORT_BY_NAME = 'name'
const SORT_BY_RECENT = 'recent'
const SORT_BY_ADDED = 'added'

export const StreamSelector = (props: Props) => {
    const {
        className,
        streams,
        onEdit,
        availableStreams,
        fetchingStreams = false,
        disabled: disabledProp,
        // $FlowFixMe flow errors make no sense
        onSearch: onSearchProp,
        hasMoreResults: hasMoreResultsProp,
        // $FlowFixMe flow errors make no sense
        onLoadMore: onLoadMoreProp,
        ...rest
    } = props
    const [sort, setSort] = useState(SORT_BY_NAME)
    const [searchText, setSearchText] = useState('')
    const [search, setSearch] = useState('')
    const [searchFocused, setSearchFocused] = useState()
    const [streamContainerRef, setStreamContainerRef] = useState(undefined)

    const onLoadMore = useCallback(() => {
        if (hasMoreResultsProp) {
            onLoadMoreProp()
        }
    }, [onLoadMoreProp, hasMoreResultsProp])

    useInfiniteScroll(onLoadMore, streamContainerRef)

    const onSearchChange = (event: SyntheticInputEvent<EventTarget>) => {
        setSearchText(event.target.value)
    }

    const onUpdateSearch = useDebounced(useCallback((searchInput) => {
        setSearch(searchInput)
    }, []), 500)

    useEffect(() => {
        onUpdateSearch(searchText)
    }, [searchText, onUpdateSearch])

    const onSearch = useCallback((searchInput) => {
        onSearchProp(searchInput)
    }, [onSearchProp])

    useEffect(() => {
        if (onSearch) {
            onSearch(search)
        }
    }, [search, onSearch])

    const matchingStreams: StreamList = useMemo(() => availableStreams.filter((stream) => (
        stream.name.toLowerCase().includes(search.toLowerCase())
    )), [availableStreams, search])

    const streamSet = useMemo(() => new Set(streams), [streams])

    const sortedStreams = useMemo(() => {
        let sortOptions
        if (sort === SORT_BY_ADDED) {
            sortOptions = ['isAdded', 'lowerName']
        }
        if (sort === SORT_BY_NAME) {
            sortOptions = ['lowerName']
        }
        if (sort === SORT_BY_RECENT) {
            sortOptions = ['lastUpdated']
        }

        return sortBy(matchingStreams.map((s) => ({
            ...s,
            lowerName: s.name.toLowerCase(),
            isAdded: -Number(streamSet.has(s.id)),
        })), sortOptions)
    }, [sort, streamSet, matchingStreams])

    const onToggle = useCallback((id: StreamId) => {
        onEdit(streams.includes(id) ? streams.filter((sid) => sid !== id) : uniq(streams.concat(id)))
    }, [streams, onEdit])

    const matchingNextStreams = useMemo(
        () => new Set(matchingStreams.filter((x) => streamSet.has(x.id))),
        [matchingStreams, streamSet],
    )
    const allVisibleStreamsSelected = useMemo(
        () => (matchingNextStreams.size === matchingStreams.length),
        [matchingNextStreams, matchingStreams],
    )

    const onSelectAll = useCallback((ids: StreamIdList) => {
        onEdit(uniq(streams.concat(ids)))
    }, [onEdit, streams])

    const onSelectNone = useCallback((ids: StreamIdList) => {
        onEdit(uniq(streams.filter((id) => !ids.includes(id))))
    }, [streams, onEdit])

    const { hasError, error } = useLastError(rest)

    const isDisabled = disabledProp || fetchingStreams

    return (
        <React.Fragment>
            <div className={className}>
                <div
                    className={classNames(styles.root, {
                        [styles.withError]: !!hasError,
                        [styles.disabled]: !!isDisabled,
                    })}
                >
                    <div className={styles.inputContainer}>
                        <SvgIcon name="search" className={styles.SearchIcon} />
                        <div className={styles.inputWrapper}>
                            <Input
                                className={styles.input}
                                onChange={onSearchChange}
                                value={searchText}
                                placeholder={I18n.t('streamSelector.typeToSearch')}
                                disabled={!!isDisabled && !searchFocused}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={() => setSearchText('')}
                                hidden={!searchText}
                            >
                                <SvgIcon name="cross" />
                            </button>
                        </div>
                        <DropdownActions
                            className={classNames(styles.sortDropdown, styles.dropdown)}
                            title={
                                <span className={styles.sortDropdownTitle}>
                                    <Translate value="streamSelector.sort" />
                                    &nbsp;
                                    {sort}
                                </span>
                            }
                            disabled={!!isDisabled}
                        >
                            <DropdownActions.Item onClick={() => setSort(SORT_BY_NAME)}>
                                <Translate value="streamSelector.sortByName" />
                            </DropdownActions.Item>
                            <DropdownActions.Item onClick={() => setSort(SORT_BY_RECENT)}>
                                <Translate value="streamSelector.sortByRecent" />
                            </DropdownActions.Item>
                            <DropdownActions.Item onClick={() => setSort(SORT_BY_ADDED)}>
                                <Translate value="streamSelector.sortByAdded" />
                            </DropdownActions.Item>
                        </DropdownActions>
                    </div>
                    <div className={styles.streams} ref={(node) => setStreamContainerRef(node)}>
                        {!fetchingStreams && !sortedStreams.length && (
                            <div className={styles.noAvailableStreams}>
                                <p><Translate value={`streamSelector.${search ? 'noStreamResults' : 'noStreams'}`} /></p>
                                {!search && (
                                    <a href={links.userpages.streamCreate} className={styles.streamCreateButton}>
                                        <Translate value="streamSelector.create" />
                                    </a>
                                )}
                            </div>
                        )}
                        {sortedStreams.map((stream: Stream) => (
                            <div
                                key={stream.id}
                                className={classNames(styles.stream, {
                                    [styles.selected]: streamSet.has(stream.id),
                                })}
                                title={[stream.name, stream.description].filter(Boolean).join('\n\n')}
                            >
                                <button
                                    type="button"
                                    className={styles.addButton}
                                    onClick={() => {
                                        onToggle(stream.id)
                                    }}
                                    disabled={!!isDisabled}
                                >
                                    {stream.name}
                                </button>
                            </div>
                        ))}
                        {!!hasMoreResultsProp && !!fetchingStreams && (
                            <div className={styles.loadMoreResults}>
                                <Spinner size="small" color="gray" />
                            </div>
                        )}
                        {!!fetchingStreams && (
                            <LoadingIndicator className={styles.loadingIndicator} loading />
                        )}
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.selectedCount}>
                            {streamSet.size !== 1 ?
                                <Translate value="streamSelector.selectedStreams" streamCount={streamSet.size} /> :
                                <Translate value="streamSelector.selectedStream" streamCount={streamSet.size} />
                            }
                        </div>
                        <Button
                            kind="secondary"
                            onClick={() => {
                                const toSelect = matchingStreams.map((s) => s.id)

                                if (allVisibleStreamsSelected) {
                                    onSelectNone(toSelect)
                                } else {
                                    onSelectAll(toSelect)
                                }
                            }}
                            disabled={!!isDisabled}
                        >
                            {!allVisibleStreamsSelected
                                ? <Translate value="streamSelector.selectAll" />
                                : <Translate value="streamSelector.selectNone" />
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <Errors>
                {!!hasError && error}
            </Errors>
        </React.Fragment>
    )
}

export default StreamSelector
