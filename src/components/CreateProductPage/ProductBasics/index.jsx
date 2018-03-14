// @flow

import React from 'react'
import { Form, Input } from '@streamr/streamr-layout'

import type { Category, CategoryList } from '../../../flowtype/category-types'
import FormGroup from '../FormGroup'

export type Props = {
    categories: CategoryList,
}

const ProductBasics = ({ categories }: Props) => (
    <Form>
        <FormGroup title="name" id="name">
            <Input type="text" name="name" id="name" placeholder="name" />
        </FormGroup>
        <FormGroup title="description" id="description">
            <Input type="text" name="description" id="description" placeholder="description" />
        </FormGroup>
        <FormGroup title="imageUrl" id="imageUrl">
            <Input type="text" name="imageUrl" id="imageUrl" placeholder="imageUrl" />
        </FormGroup>
        <FormGroup id="category">
            <Input type="select" name="category" id="category">
                <option>-- choose ---</option>
                {categories && categories.map(({ id, name }: Category) => (
                    <option key={id}>{name}</option>
                ))}
            </Input>
        </FormGroup>
    </Form>
)

export default ProductBasics
