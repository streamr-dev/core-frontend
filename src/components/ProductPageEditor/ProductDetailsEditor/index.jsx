// @flow

import React from 'react'
import { Button, Input } from '@streamr/streamr-layout'
import styles from './ProductDetailsEditor.pcss'
import type { Product } from '../../../flowtype/product-types'

type Props = {
    product: Product,
    onEdit: (field: string, value: string) => void,
    openPriceDialog: () => void,
}

const ProductDetailsEditor = ({ product, onEdit, openPriceDialog }: Props) => (
    <div className={styles.details}>
        <Input
            type="text"
            name="name"
            id="name"
            placeholder="name"
            defaultValue={product.name}
            onChange={(e: SyntheticInputEvent<EventTarget>) => onEdit('name', e.target.value)}
        />
        <Input
            type="text"
            name="description"
            id="description"
            placeholder="description"
            defaultValue={product.description}
            onChange={(e: SyntheticInputEvent<EventTarget>) => onEdit('description', e.target.value)}
        />
        <Button color="primary">Get Streams</Button>
        <Button color="primary" onClick={openPriceDialog}>Set price</Button>
    </div>
)

export default ProductDetailsEditor
