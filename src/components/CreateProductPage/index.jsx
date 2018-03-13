// @flow

import React from 'react'
import { Container, Form, Input } from '@streamr/streamr-layout'

import type { Category, CategoryList } from '../../flowtype/category-types'
import FormGroup from './FormGroup'

import styles from './createproductpage.pcss'

export type Props = {
    categories: CategoryList,
}

const CreateProductPage = ({ categories }: Props) => (
    <div className={styles.createProductPage}>
        <Container>
            <h1>Create product</h1>

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
        </Container>
    </div>
)

export default CreateProductPage
