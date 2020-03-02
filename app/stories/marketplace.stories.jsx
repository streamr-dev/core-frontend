// @flow

import React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'

import store from './utils/i18nStore'

import Products from '$mp/components/Products'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import ExpirationCounter from '$mp/components/ExpirationCounter'
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

story('ProductTypeChooser')
    .addWithJSX('basic', () => (
        <ProductTypeChooser />
    ))

const now = Date.now() // Use `undefined` to unfreeze time here!

story('ExpirationCounter')
    .addWithJSX('more than a day', () => (
        <ExpirationCounter
            now={now}
            expiresAt={new Date((now || Date.now()) + (2 * 24 * 60 * 60 * 1000))}
        />
    ))
    .addWithJSX('less than hour', () => (
        <ExpirationCounter
            now={now}
            expiresAt={new Date((now || Date.now()) + (1 * 60 * 1000))}
        />
    ))
    .addWithJSX('less than a day', () => (
        <ExpirationCounter
            now={now}
            expiresAt={new Date((now || Date.now()) + (20 * 60 * 60 * 1000))}
        />
    ))
    .addWithJSX('expired', () => (
        <ExpirationCounter
            now={now}
            expiresAt={new Date((now || Date.now()) - (60 * 60 * 1000))}
        />
    ))
