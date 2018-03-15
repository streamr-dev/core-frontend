// @flow

import React from 'react'
import { Form, Input } from '@streamr/streamr-layout'

import type { Category, CategoryList } from '../../../flowtype/category-types'
import type { Product } from '../../../flowtype/product-types'
import FormGroup from '../FormGroup'

export type Props = {
    product: Product,
    categories: CategoryList,
    onChange: (field: string, value: any) => void,
}

const ProductBasics = ({ product, categories, onChange }: Props) => (
    <Form>
        <FormGroup title="name" id="name">
            <Input
                type="text"
                name="name"
                id="name"
                placeholder="name"
                value={product.name}
                onChange={(e: SyntheticInputEvent<EventTarget>) => onChange('name', e.target.value)}
            />
        </FormGroup>
        <FormGroup title="description" id="description">
            <Input
                type="text"
                name="description"
                id="description"
                placeholder="description"
                value={product.description}
                onChange={(e: SyntheticInputEvent<EventTarget>) => onChange('description', e.target.value)}
            />
        </FormGroup>
        <FormGroup title="imageUrl" id="imageUrl">
            <Input
                type="text"
                name="imageUrl"
                id="imageUrl"
                placeholder="imageUrl"
                value={product.imageUrl}
                onChange={(e: SyntheticInputEvent<EventTarget>) => onChange('imageUrl', e.target.value)}
            />
        </FormGroup>
        <FormGroup id="category">
            <Input
                type="select"
                name="category"
                id="category"
                value={product.category || ''}
                onChange={(e: SyntheticInputEvent<EventTarget>) => onChange('category', e.target.value)}
            >
                <option>-- choose ---</option>
                {categories && categories.map(({ id, name }: Category) => (
                    <option key={id} value={id}>{name}</option>
                ))}
            </Input>
        </FormGroup>
    </Form>
)

export default ProductBasics
