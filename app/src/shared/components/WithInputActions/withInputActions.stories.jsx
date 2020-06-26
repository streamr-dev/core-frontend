// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'

import Popover from '$shared/components/Popover'
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
            <Popover.Item key="1">
                Some Action
            </Popover.Item>,
        ]}
    >
        <Text />
    </WithInputActions>
))

stories.add('disabled', () => (
    <WithInputActions
        actions={[
            <Popover.Item key="1">
                Some Action
            </Popover.Item>,
        ]}
        disabled
    >
        <Text />
    </WithInputActions>
))
