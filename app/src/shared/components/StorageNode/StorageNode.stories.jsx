import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { withKnobs, boolean, text } from '@storybook/addon-knobs'
import StorageNode from '.'

const story = (name) => storiesOf(`Shared/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
        padding: '15px',
    }))
    .addDecorator(withKnobs)

story('StorageNode').add('with knobs', () => (
    <StorageNode
        disabled={boolean('Disabled', false)}
        checked={boolean('Checked', false)}
    >
        {text('Location name', 'United States of America')}
    </StorageNode>
))

story('StorageNode').add('state line-up', () => (
    <React.Fragment>
        <StorageNode>Normal</StorageNode>
        <StorageNode checked>Checked</StorageNode>
        <StorageNode disabled>Disabled</StorageNode>
        <StorageNode checked disabled>Checked + disabled</StorageNode>
    </React.Fragment>
))

story('StorageNode').add('long location names handling', () => (
    <React.Fragment>
        <StorageNode>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNode>
        <StorageNode checked>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNode>
        <StorageNode disabled>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNode>
        <StorageNode checked disabled>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam cursus efficitur orci,
            at gravida purus varius quis. Pellentesque pulvinar ornare purus, eu commodo leo
            ornare ut. Sed fringilla nibh et urna elementum blandit.
        </StorageNode>
    </React.Fragment>
))
