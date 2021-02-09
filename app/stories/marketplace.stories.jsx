// @flow

import React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'

import Products from '$mp/components/Products'
import store from './utils/i18nStore'

import exampleProductList from './exampleProductList'

const story = (name) => storiesOf(`Marketplace/${name}`, module)
    .addDecorator(StoryRouter())
    .addDecorator((callback) => (<Provider store={store}>{callback()}</Provider>))

story('ProductList')
    .addWithJSX('basic', () => (
        <Products.Container fluid>
            <Products
                products={exampleProductList}
                type="products"
            />
        </Products.Container>
    ))
    .addWithJSX('no products', () => (
        <Products.Container fluid>
            <Products
                products={[]}
                type="products"
            />
        </Products.Container>
    ))
    .addWithJSX('fetching', () => (
        <Products.Container fluid>
            <Products
                products={exampleProductList}
                type="products"
                isFetching
            />
        </Products.Container>
    ))
