// @flow

import React from 'react'
import BN from 'bignumber.js'
import { Provider, useSelector } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import { integrationKeyServices } from '$shared/utils/constants'
import mockStore from '$testUtils/mockStoreProvider'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'

import IntegrationKeyList from '.'

const service1 = {
    id: 'testid',
    user: 1234,
    name: 'Test',
    service: integrationKeyServices.ETHEREREUM_IDENTITY,
    json: {
        address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
    },
}
const service2 = {
    id: 'testid2',
    user: 4321,
    name: 'Test 2',
    service: integrationKeyServices.ETHEREREUM_IDENTITY,
    json: {
        address: '0xEE6eEB9547B1E537fB362C79C107Ce38183F7851',
    },
}
const service3 = {
    id: 'testid3',
    user: 1243,
    name: 'Test 3',
    service: integrationKeyServices.ETHEREREUM_IDENTITY,
    json: {
        address: '0x547B1E537fB362C79C107Ce38183F7851EE6eEB9',
    },
}

const store = {
    integrationKey: {
        ethereumIdentities: [service1.id, service2.id, service3.id],
        privateKeys: [],
        fetchingIntegrationKeys: false,
        integrationKeysError: {
        },
        balances: {
            [service1.json.address]: {
                ETH: BN('2.1'),
                DATA: BN('1.5'),
            },
            [service2.json.address]: {
                ETH: BN('540'),
                DATA: BN('123.12'),
            },
            [service3.json.address]: {
                ETH: BN('23423'),
                DATA: BN('100'),
            },
        },
    },
    entities: {
        integrationKeys: {
            [service1.id]: {
                ...service1,
            },
            [service2.id]: {
                ...service2,
            },
            [service3.id]: {
                ...service3,
            },
        },
    },
}

const stories =
    storiesOf('Userpages/IntegrationKeyList', module)
        .addDecorator(styles({
            color: '#323232',
            background: 'white',
            border: '1px dashed #DDDDDD',
            margin: '3rem',
        }))
        .addDecorator(withKnobs)
        .addDecorator((callback) => (<Provider store={mockStore(store)}>{callback()}</Provider>))

type Props = {
    hideValues?: boolean,
    truncateValues?: boolean,
    disabled?: boolean,
}

const IntegrationKeyListController = ({ hideValues, truncateValues, disabled }: Props) => {
    const editAction = action('onEdit')
    const onEdit = (...args) => new Promise((resolve) => {
        editAction(...args)

        setTimeout(resolve, 500)
    })
    const integrationKeys = useSelector(selectEthereumIdentities)

    return (
        <IntegrationKeyList
            integrationKeys={integrationKeys}
            onEdit={onEdit}
            onDelete={action('onDelete')}
            hideValues={hideValues}
            truncateValues={truncateValues}
            disabled={disabled}
        />
    )
}

stories.add('default', () => (
    <IntegrationKeyListController />
))

stories.add('values hidden', () => (
    <IntegrationKeyListController hideValues />
))

stories.add('truncated values', () => (
    <IntegrationKeyListController truncateValues />
))

stories.add('disabled', () => (
    <IntegrationKeyListController truncateValues disabled />
))
