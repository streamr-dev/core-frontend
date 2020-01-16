// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'

import StreamSelectorComponent from '$mp/components/StreamSelector'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import usePending from '$shared/hooks/usePending'
import { selectStreams, selectFetchingStreams } from '$mp/modules/streams/selectors'

import styles from './productStreams.pcss'

const ProductStreams = () => {
    const product = useEditableProduct()
    const { isValid, message } = useValidation('streams')
    const { updateStreams } = useEditableProductActions()
    const { isTouched } = useContext(ValidationContext)
    const { isPending } = usePending('product.SAVE')
    const streams = useSelector(selectStreams)
    const fetching = useSelector(selectFetchingStreams)

    return (
        <section id="streams" className={cx(styles.root, styles.StreamSelector)}>
            <div>
                <h1>Add streams</h1>
                <p>Products can contain a range of streams, or a single &quot;firehose&quot; type stream, it&apos;s up to you.
                    If you haven&apos;t made any streams yet, you can create one here. For help creating streams, see the docs.
                </p>
                <StreamSelectorComponent
                    availableStreams={streams}
                    fetchingStreams={fetching}
                    onEdit={updateStreams}
                    streams={product.streams}
                    className={styles.streams}
                    error={isTouched('streams') && !isValid ? message : undefined}
                    disabled={!!isPending}
                />
            </div>
        </section>
    )
}

export default ProductStreams
