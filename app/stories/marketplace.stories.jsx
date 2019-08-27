// $flow

import React, { useState } from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { withKnobs, boolean, number } from '@storybook/addon-knobs'

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

const SetPriceController = () => {
    const [price, setPrice] = useState(0)
    const [currency, setCurrency] = useState('DATA')
    const [timeUnit, setTimeUnit] = useState('hour')

    return (
        <SetPrice
            disabled={boolean('disabled', false)}
            price={price}
            onPriceChange={setPrice}
            currency={currency}
            onCurrencyChange={setCurrency}
            timeUnit={timeUnit}
            onTimeUnitChange={setTimeUnit}
            dataPerUsd={number('dataPerUsd', 0.5)}
        />
    )
}

story('SetPrice')
    .addDecorator(styles({
        backgroundColor: '#F8F8F8',
        padding: '15px',
    }))
    .addDecorator(withKnobs)
    .addWithJSX('basic', () => (
        <SetPriceController />
    ))

