import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean, text } from '@storybook/addon-knobs'
import StorageNodeItem from './StorageNodeItem'

const story = (name) => storiesOf(`Shared/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
        padding: '15px',
    }))
    .addDecorator(withKnobs)

story('StorageNodeItem').add('with knobs', () => (
    <StorageNodeItem
        disabled={boolean('Disabled', false)}
        active={boolean('Active', false)}
        onClick={action('onClick')}
    >
        {text('Location name', 'United States of America')}
    </StorageNodeItem>
))

story('StorageNodeItem').add('state line-up', () => (
    <React.Fragment>
        <StorageNodeItem>Busy</StorageNodeItem>
        <StorageNodeItem active>Active</StorageNodeItem>
        <StorageNodeItem active={false}>Inactive</StorageNodeItem>
        <StorageNodeItem disabled>Busy disabled</StorageNodeItem>
        <StorageNodeItem active disabled>Active + disabled</StorageNodeItem>
        <StorageNodeItem active={false} disabled>Inactive + disabled</StorageNodeItem>
    </React.Fragment>
))

story('StorageNodeItem').add('long location names handling', () => (
    <React.Fragment>
        <StorageNodeItem>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNodeItem>
        <StorageNodeItem active>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNodeItem>
        <StorageNodeItem active={false}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNodeItem>
        <StorageNodeItem disabled>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNodeItem>
        <StorageNodeItem active disabled>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNodeItem>
        <StorageNodeItem active={false} disabled>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNodeItem>
    </React.Fragment>
))
