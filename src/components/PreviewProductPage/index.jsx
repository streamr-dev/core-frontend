// @flow

import React from 'react'
import ProductPage from '../ProductPage'
import { formatPath } from '../../utils/url'

import type { Props as ProductPageProps } from '../ProductPage'

import links from '../../links'

export type Props = ProductPageProps & {
    onSave: () => void,
    onPublish: () => void,
}

const PreviewProductPage = ({ product, streams, onSave, onPublish }: Props) => (
    <div>
        <ProductPage
            product={product}
            streams={streams}
            showToolbar
            toolbarActions={{
                edit: {
                    title: 'Edit',
                    linkTo: formatPath(links.createProduct),
                },
                save: {
                    title: 'Save',
                    onClick: onSave,
                },
                publish: {
                    title: 'Publish',
                    onClick: onPublish,
                    color: 'primary',
                },
            }}
            showRelated={false}
        />
    </div>
)

export default PreviewProductPage
