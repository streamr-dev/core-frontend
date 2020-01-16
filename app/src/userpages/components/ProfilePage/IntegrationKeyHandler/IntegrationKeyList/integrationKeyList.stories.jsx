// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import { integrationKeyServices } from '$shared/utils/constants'

import IntegrationKeyList from '.'

const stories =
    storiesOf('Userpages/IntegrationKeyList', module)
        .addDecorator(styles({
            color: '#323232',
            background: 'white',
            border: '1px dashed #DDDDDD',
            margin: '3rem',
        }))
        .addDecorator(withKnobs)

const integrationKeys = [{
    id: 'testid',
    user: 1234,
    name: 'Test',
    service: integrationKeyServices.ETHEREREUM_IDENTITY,
    json: {
        address: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
    },
}, {
    id: 'testid2',
    user: 4321,
    name: 'Test 2',
    service: integrationKeyServices.ETHEREREUM_IDENTITY,
    json: {
        address: '0xEE6eEB9547B1E537fB362C79C107Ce38183F7851',
    },
}, {
    id: 'testid3',
    user: 1243,
    name: 'Test 3',
    service: integrationKeyServices.ETHEREREUM_IDENTITY,
    json: {
        address: '0x547B1E537fB362C79C107Ce38183F7851EE6eEB9',
    },
}]

type Props = {
    hideValues?: boolean,
    truncateValues?: boolean,
}

const IntegrationKeyListController = ({ hideValues, truncateValues }: Props) => {
    const editAction = action('onEdit')
    const onEdit = (...args) => new Promise((resolve) => {
        editAction(...args)

        setTimeout(resolve, 500)
    })

    return (
        <IntegrationKeyList
            integrationKeys={integrationKeys}
            onEdit={onEdit}
            onDelete={action('onDelete')}
            hideValues={hideValues}
            truncateValues={truncateValues}
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
