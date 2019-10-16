// @flow

import React, { useState } from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { withKnobs, boolean, number, select } from '@storybook/addon-knobs'

import store from './utils/i18nStore'

import Products from '$mp/components/Products'
import ProductTypeChooser from '$mp/components/ProductTypeChooser'
import MarkdownEditor from '$mp/components/MarkdownEditor'
import SetPrice from '$mp/components/SetPrice'
import exampleProductList from './exampleProductList'
import CompletePublishTransaction from '$mp/components/Modal/CompletePublishTransaction'
import { transactionStates } from '$shared/utils/constants'
import { actionsTypes } from '$mp/containers/EditProductPage2/publishQueue'

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
        <ProductTypeChooser onSelect={() => {}} />
    ))

story('MarkdownEditor')
    .addWithJSX('basic', () => (
        <MarkdownEditor placeholder="Type here" />
    ))

const SetPriceController = () => {
    const [price, setPrice] = useState('0')
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

type CompletePublishControllerProps = {
    isUnpublish?: boolean,
}

const CompletePublishController = ({ isUnpublish = false }: CompletePublishControllerProps) => {
    const options = [
        transactionStates.PENDING,
        transactionStates.CONFIRMED,
        transactionStates.FAILED,
    ]

    let statuses = {}

    if (isUnpublish) {
        const unpublishFreeStatus = select('Unpublish free', options, transactionStates.PENDING)
        const undeployPaidStatus = select('Undeploy paid', options, transactionStates.PENDING)

        statuses = {
            [actionsTypes.UNPUBLISH_FREE]: unpublishFreeStatus,
            [actionsTypes.UNDEPLOY_CONTRACT_PRODUCT]: undeployPaidStatus,
        }
    } else {
        const adminFeeStatus = select('Admin Fee', options, transactionStates.PENDING)
        const updateContractStatus = select('Edit product price', options, transactionStates.PENDING)
        const createContractStatus = select('Create contract product', options, transactionStates.PENDING)
        const redeployPaidStatus = select('Redeploy paid', options, transactionStates.PENDING)
        const publishFreeStatus = select('Publish free', options, transactionStates.PENDING)

        statuses = {
            [actionsTypes.UPDATE_ADMIN_FEE]: adminFeeStatus,
            [actionsTypes.UPDATE_CONTRACT_PRODUCT]: updateContractStatus,
            [actionsTypes.CREATE_CONTRACT_PRODUCT]: createContractStatus,
            [actionsTypes.REDEPLOY_PAID]: redeployPaidStatus,
            [actionsTypes.PUBLISH_FREE]: publishFreeStatus,
        }
    }

    return (
        <CompletePublishTransaction
            isUnpublish={isUnpublish}
            onCancel={() => {}}
            status={statuses}
        />
    )
}

story('Publish Dialog')
    .addDecorator(withKnobs)
    .addWithJSX('Publish', () => (
        <CompletePublishController />
    ))
    .addWithJSX('Unpublish', () => (
        <CompletePublishController isUnpublish />
    ))
