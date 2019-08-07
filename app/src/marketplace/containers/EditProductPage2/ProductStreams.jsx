// @flow

import React from 'react'
import cx from 'classnames'
import ScrollableAnchor from 'react-scrollable-anchor'

import StreamSelectorComponent from '$mp/components/StreamSelector'
import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'

import AvailableStreams from '../AvailableStreams'
import styles from './productStreams.pcss'

const ProductStreams = () => {
    const product = useProduct()
    const { isValid, level, message } = useValidation('streams')
    const { updateStreams } = useProductActions()

    return (
        <ScrollableAnchor id="streams">
            <div className={cx(styles.root, styles.StreamSelector)}>
                <h1>Add streams</h1>
                <p>Products can contain a range of streams, or a single &quot;firehose&quot; type stream, it&apos;s up to you.
                    If you haven&apos;t made any streams yet, you can create one here. For help creating streams, see the docs.
                </p>
                <AvailableStreams>
                    {({ fetching, streams }) => (
                        <StreamSelectorComponent
                            availableStreams={streams}
                            fetchingStreams={fetching}
                            onEdit={updateStreams}
                            streams={product.streams}
                            className={styles.streams}
                        />
                    )}
                </AvailableStreams>
                {!isValid && (
                    <p>{level}: {message}</p>
                )}
            </div>
        </ScrollableAnchor>
    )
}

export default ProductStreams
