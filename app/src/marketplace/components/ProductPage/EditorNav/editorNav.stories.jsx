// $flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
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
    heading: 'Name',
}, {
    id: 'coverImage',
    heading: 'Cover Image',
}, {
    id: 'description',
    heading: 'Description',
}, {
    id: 'streams',
    heading: 'Streams',
}, {
    id: 'price',
    heading: 'Price',
}, {
    id: 'details',
    heading: 'Details',
}]

const EditNavController = () => {
    const [activeSection, setActiveSection] = useState(null)
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

    const sectionsData = sections.map(({ id, ...section }) => ({
        id,
        ...section,
        status: statusValues[id],
        onClick: () => setActiveSection(id),
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
