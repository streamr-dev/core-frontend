// @flow

import React from 'react'
import cx from 'classnames'

import StreamSelectorComponent from '$mp/components/StreamSelector'
import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'

import AvailableStreams from '../AvailableStreams'
import styles from './productStreams.pcss'

const ProductStreams = () => {
    const product = useProduct()
    const { isValid, message } = useValidation('streams')
    const { updateStreams } = useProductActions()

    return (
        <section id="streams" className={cx(styles.root, styles.StreamSelector)}>
            <div>
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
                            error={!isValid ? message : undefined}
                        />
                    )}
                </AvailableStreams>
            </div>
        </section>
    )
}

export default ProductStreams
