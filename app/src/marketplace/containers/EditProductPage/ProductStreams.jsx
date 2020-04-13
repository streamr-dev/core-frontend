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
import routes from '$routes'

import styles from './productStreams.pcss'

const STREAMS_PAGE_SIZE = 100

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
    const { loadStreams } = useController()
    const [offset, setOffset] = useState(0)

    const onLoadMore = useCallback(() => {
        setOffset((prevOffset) => prevOffset + STREAMS_PAGE_SIZE)
    }, [])

    useEffect(() => {
        loadStreams({
            max: STREAMS_PAGE_SIZE,
            offset,
        })
    }, [loadStreams, offset])

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
                />
            </div>
        </section>
    )
}

export default ProductStreams
