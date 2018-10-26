// $flow

import React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'

import store from './utils/i18nStore'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withNotes } from '@storybook/addon-notes'
import { withKnobs, text, array, number } from '@storybook/addon-knobs/react'

import Products from '$mp/components/Products'
import exampleProductList from './exampleProductList'

const story = (name) => storiesOf(`Marketplace/${name}`, module)
    .addDecorator(StoryRouter())
    .addDecorator((story) => (<Provider store={store}>{story()}</Provider>))
    .addDecorator(withKnobs)

story('ProductList')
    .add('basic', () => (
        <Products
            products={exampleProductList}
            type="products"
        />
    ))
    .add('no products', () => (
        <Products
            products={[]}
            type="products"
        />
    ))
    .add('fetching', () => (
        <Products
            products={exampleProductList}
            type="products"
            isFetching
        />
    ))
