// $flow

import React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import store from './utils/i18nStore'

import Products from '$mp/components/Products'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import MarkdownEditor from '$mp/components/MarkdownEditor'
import SetPrice from '$mp/components/SetPrice'
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

story('MarkdownEditor')
    .addWithJSX('basic', () => (
        <MarkdownEditor placeholder="Type here" />
    ))

story('SetPrice')
    .addWithJSX('basic', () => (
        <SetPrice dataPerUsd={0.5} onChange={action('onChange')} />
    ))
