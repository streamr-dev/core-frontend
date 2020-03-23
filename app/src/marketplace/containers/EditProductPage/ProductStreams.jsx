// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'

import StreamSelectorComponent from '$mp/components/StreamSelector'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
import usePending from '$shared/hooks/usePending'
import { selectStreams, selectFetchingStreams } from '$mp/modules/streams/selectors'
import routes from '$routes'

import styles from './productStreams.pcss'

const ProductStreams = () => {
    const product = useEditableProduct()
    const { isValid, message } = useValidation('streams')
    const { updateStreams } = useEditableProductActions()
    const { publishAttempted } = useContext(EditControllerContext)
    const { isPending } = usePending('product.SAVE')
    const streams = useSelector(selectStreams)
    const fetching = useSelector(selectFetchingStreams)

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
                    availableStreams={streams}
                    fetchingStreams={fetching}
                    onEdit={updateStreams}
                    streams={product.streams}
                    className={styles.streams}
                    error={publishAttempted && !isValid ? message : undefined}
                    disabled={!!isPending}
                />
            </div>
        </section>
    )
}

export default ProductStreams
