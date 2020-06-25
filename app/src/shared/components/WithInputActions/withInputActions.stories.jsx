// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'

import DropdownActions from '$shared/components/DropdownActions'
import Text from '$ui/Text'

import WithInputActions from '.'

const stories =
    storiesOf('Shared/WithInputActions', module)
        .addDecorator(styles({
            padding: '2rem',
            color: 'black',
        }))

stories.add('basic', () => (
    <WithInputActions
        actions={[
            <DropdownActions.Item key="1">
                Some Action
            </DropdownActions.Item>,
        ]}
    >
        <Text />
    </WithInputActions>
))

stories.add('disabled', () => (
    <WithInputActions
        actions={[
            <DropdownActions.Item key="1">
                Some Action
            </DropdownActions.Item>,
        ]}
        disabled
    >
        <Text />
    </WithInputActions>
))
