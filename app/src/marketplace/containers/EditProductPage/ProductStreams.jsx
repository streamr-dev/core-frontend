// @flow

import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import uniqBy from 'lodash/uniqBy'

import StreamSelectorComponent from '$mp/components/StreamSelector'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { useController } from '../ProductController'
import { Context as EditControllerContext } from './EditControllerProvider'
import usePending from '$shared/hooks/usePending'
import { selectStreams, selectFetchingStreams, selectHasMoreResults } from '$mp/modules/streams/selectors'
import {
    selectStreams as selectProductStreams,
    selectFetchingStreams as selectFetchingProductStreams,
} from '$mp/modules/product/selectors'
import { useDebounced, useThrottled } from '$shared/hooks/wrapCallback'
import routes from '$routes'

import styles from './productStreams.pcss'

const STREAMS_PAGE_SIZE = 999

const ProductStreams = () => {
    const product = useEditableProduct()
    const { isValid, message } = useValidation('streams')
    const { updateStreams } = useEditableProductActions()
    const { publishAttempted } = useContext(EditControllerContext)
    const { isPending } = usePending('product.SAVE')
    const streams = useSelector(selectStreams)
    const fetching = useSelector(selectFetchingStreams)
    const productStreams = useSelector(selectProductStreams)
    const fetchingProductStreams = useSelector(selectFetchingProductStreams)
    const hasMoreResults = useSelector(selectHasMoreResults)
    const { loadStreams, clearStreams } = useController()
    const [params, setParams] = useState({
        offset: 0,
    })

    const onLoadMore = useCallback(() => {
        setParams((prevParams) => ({
            ...prevParams,
            offset: prevParams.offset + STREAMS_PAGE_SIZE,
        }))
    }, [])

    const clearStreamList = useThrottled(useCallback(() => {
        clearStreams()
    }, [clearStreams]))
    const doSearch = useDebounced(useCallback((search) => {
        setParams({
            offset: 0,
            search,
        })
    }, []), 500)
    const onSearch = useCallback((search) => {
        clearStreamList()
        doSearch(search)
    }, [clearStreamList, doSearch])

    useEffect(() => {
        loadStreams({
            max: STREAMS_PAGE_SIZE,
            ...params,
        })
    }, [loadStreams, params])

    const availableStreams = useMemo(() => uniqBy([...streams, ...productStreams], 'id'), [streams, productStreams])

    return (
        <section id="streams" className={cx(styles.root, styles.StreamSelector)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.streams.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.streams.description"
                    docsLink={routes.docsProductsIntroToProducts()}
                    dangerousHTML
                />
                <StreamSelectorComponent
                    availableStreams={availableStreams}
                    fetchingStreams={fetchingProductStreams || fetching}
                    onEdit={updateStreams}
                    streams={product.streams}
                    className={styles.streams}
                    error={publishAttempted && !isValid ? message : undefined}
                    disabled={!!isPending}
                    hasMoreResults={hasMoreResults}
                    onLoadMore={onLoadMore}
                    onSearch={onSearch}
                />
            </div>
        </section>
    )
}

export default ProductStreams
