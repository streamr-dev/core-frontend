import React from 'react'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import Products from '$mp/components/Products'
import exampleProductList from './exampleProductList'

const story = (name) => storiesOf(`Marketplace/${name}`, module).addDecorator(StoryRouter())

story('ProductList')
    .add('basic', () => (
        <Products.Container fluid>
            <Products products={exampleProductList} type="products" />
        </Products.Container>
    ))
    .add('no products', () => (
        <Products.Container fluid>
            <Products products={[]} type="products" />
        </Products.Container>
    ))
    .add('fetching', () => (
        <Products.Container fluid>
            <Products products={exampleProductList} type="products" isFetching />
        </Products.Container>
    ))
