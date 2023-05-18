import React, { useState } from 'react'
import {Meta} from "@storybook/react"
import EditorNav, { statuses } from '.'
const sections = [
    {
        id: 'name',
        heading: 'Name',
    },
    {
        id: 'coverImage',
        heading: 'Cover Image',
    },
    {
        id: 'description',
        heading: 'Description',
    },
    {
        id: 'streams',
        heading: 'Streams',
    },
    {
        id: 'price',
        heading: 'Price',
    },
    {
        id: 'details',
        heading: 'Details',
    },
]

const EditNavController = (props) => {
    const [activeSection, setActiveSection] = useState('')
    const nameStatus = statuses.EMPTY
    const coverImageStatus = statuses.EMPTY
    const descriptionStatus = statuses.EMPTY
    const streamsStatus = statuses.EMPTY
    const priceStatus = statuses.EMPTY
    const datailsStatus = statuses.EMPTY
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
        <div
            style={{
                width: '180px',
            }}
        >
            <EditorNav sections={sectionsData} activeSection={activeSection} {...props} />
        </div>
    )
}

const meta: Meta<typeof EditNavController> = {
    title: 'Marketplace/ProductPage/EditorNav',
    component: EditNavController,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

export const Basic = () => <EditNavController />

Basic.story = {
    name: 'Basic'
}

export const WithErrors = () => <EditNavController showErrors />

WithErrors.story = {
    name: 'With errors',
}

export const WithErrorsTracking = () => <EditNavController showErrors trackScrolling />

WithErrorsTracking.story = {
    name: 'With errors & tracking',
}

