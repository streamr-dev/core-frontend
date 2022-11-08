import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import MobileFilter from '.'
const stories = storiesOf('Shared/MobileFilter', module).addDecorator(
    styles({
        color: '#323232',
        padding: '2rem',
    }),
)
const storyFn = () => {
    const filters = [{
        label: 'Category',
        value: 'category',
        options: [
            {label: 'Business', value: 'business'},
            {label: 'Environment', value: 'environment'},
            {label: 'Entertainment', value: 'entertainment'},
            {label: 'Social Media', value: 'social_media'},
            {label: 'Education', value: 'education'},
            {label: 'Sports', value: 'sports'},
            {label: 'Transportation', value: 'transportation'},
            {label: 'IoT', value: 'iot'},
            {label: 'Very long name of a filter, like really long, or more like insanely long', value: 'long_filter'}
        ]
    }, {
        label: 'Project type',
        value: 'project_type',
        options: [
            {label: 'Data Union', value: 'data_union'},
            {label: 'Paid Data', value: 'paid_data'},
            {label: 'Open Data', value: 'open_data'}
        ]
    }]
    return <>
        <MobileFilter
            onChange={action('filterChanged')}
            filters={filters}
        />
    </>
}

stories.add('default', () => (
    <div>
        <div id="content">{storyFn()}</div>
        <div id="modal-root" />
    </div>
))
