// @flow

import React from 'react'
import ProductPage from '../ProductPage'

import PreviewActions from './PreviewActions'

import type { Props as ProductPageProps } from '../ProductPage'
import type { Props as PreviewActionsProps } from './PreviewActions'

export type Props = ProductPageProps & PreviewActionsProps

const PreviewProductPage = ({ product, onSave, onPublish }: Props) => (
    <div>
        <PreviewActions onSave={onSave} onPublish={onPublish} />
        <ProductPage product={product} streams={[]} />
    </div>
)

export default PreviewProductPage
