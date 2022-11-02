import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import Text from '$ui/Text'
import PopoverItem from '$shared/components/Popover/PopoverItem'
import WithInputActions from '.'
const stories = storiesOf('Shared/WithInputActions', module).addDecorator(
    styles({
        padding: '2rem',
        color: 'black',
    }),
)
stories.add('basic', () => (
    <WithInputActions actions={[<PopoverItem key="1">Some Action</PopoverItem>]}>
        <Text />
    </WithInputActions>
))
stories.add('disabled', () => (
    <WithInputActions actions={[<PopoverItem key="1">Some Action</PopoverItem>]} disabled>
        <Text />
    </WithInputActions>
))
