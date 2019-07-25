// @flow

import React from 'react'

import StreamSelectorComponent from '$mp/components/StreamSelector'
import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'

import AvailableStreams from '../AvailableStreams'

const StreamSelector = () => {
    const product = useProduct()
    const { isValid, level, message } = useValidation('streams')
    const { updateStreams } = useProductActions()

    return (
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
                    />
                )}
            </AvailableStreams>
            {!isValid && (
                <p>{level}: {message}</p>
            )}
        </div>
    )
}

export default StreamSelector
