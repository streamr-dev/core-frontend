// @flow

import React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'

import store from './utils/i18nStore'

import Products from '$mp/components/Products'
import exampleProductList from './exampleProductList'

const story = (name) => storiesOf(`Marketplace/${name}`, module)
    .addDecorator(StoryRouter())
    .addDecorator((callback) => (<Provider store={store}>{callback()}</Provider>))

story('ProductList')
    .addWithJSX('basic', () => (
        <Products
            products={exampleProductList}
            type="products"
        />
    ))
    .addWithJSX('no products', () => (
        <Products
            products={[]}
            type="products"
        />
    ))
    .addWithJSX('fetching', () => (
        <Products
            products={exampleProductList}
            type="products"
            isFetching
        />
    ))
