// $flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, select } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import EditorNav, { statuses } from '.'

const stories =
    storiesOf('Marketplace/ProductPage/EditorNav', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

const sections = [{
    id: 'name',
    title: 'Name',
    onClick: action('Name'),
}, {
    id: 'coverImage',
    title: 'Cover Image',
    onClick: action('Cover Image'),
}, {
    id: 'description',
    title: 'Description',
    onClick: action('Description'),
}, {
    id: 'streams',
    title: 'Streams',
    onClick: action('Streams'),
}, {
    id: 'price',
    title: 'Price',
    onClick: action('Price'),
}, {
    id: 'details',
    title: 'Details',
    onClick: action('Details'),
}]

const EditNavController = () => {
    const nameStatus = select('Name', statuses, statuses.EMPTY)
    const coverImageStatus = select('Cover Image', statuses, statuses.EMPTY)
    const descriptionStatus = select('Description', statuses, statuses.EMPTY)
    const streamsStatus = select('Streams', statuses, statuses.EMPTY)
    const priceStatus = select('Price', statuses, statuses.EMPTY)
    const datailsStatus = select('Details', statuses, statuses.EMPTY)

    const statusValues = {
        name: nameStatus,
        coverImage: coverImageStatus,
        description: descriptionStatus,
        streams: streamsStatus,
        price: priceStatus,
        details: datailsStatus,
    }
    const sectionNames = ['-', ...sections.map(({ id }) => id)]
    const activeSection = select('Active section', sectionNames)

    const sectionsData = sections.map(({ id, ...section }) => ({
        id,
        ...section,
        status: statusValues[id],
    }))

    return (
        <div style={{
            width: '180px',
        }}
        >
            <EditorNav
                sections={sectionsData}
                activeSection={activeSection}
            />
        </div>
    )
}

stories.add('basic', () => (
    <EditNavController />
))
