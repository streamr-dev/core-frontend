import React from 'react'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { COLORS } from '$shared/utils/styled'
import { ScrollTable, ScrollTableAction, ScrollTableColumnDef } from './ScrollTable'

const Container = styled.div`
    display: block;
    padding: 2rem 10px;
    color: ${COLORS.primary};
    background-color: ${COLORS.secondary};
`
type SomeElement = {
    id: string
    name: string
    value: number
    valuePerHour: string
    apy: string
    share: string
    cut: string
    bounties: number
    totalStake: string
}
const elements: SomeElement[] = [
    {
        id: '123123123',
        name: 'LoremIpsum',
        value: 134,
        valuePerHour: '245435/h',
        apy: '13%',
        share: '20%',
        cut: '25%',
        bounties: 2,
        totalStake: '23000 DATA',
    },
    {
        id: '74315d30-5110-42b8-bfc7-2040023e7426',
        name: 'Dolor',
        value: 4324,
        valuePerHour: '32423422/h',
        apy: '9%',
        share: '14%',
        cut: '41%',
        bounties: 54,
        totalStake: '321000 DATA',
    },
]

const columns: ScrollTableColumnDef<SomeElement>[] = [
    {
        key: 'name',
        displayName: 'Name',
        isSticky: true,
        valueMapper: (element) => element.name,
        align: 'start',
    },
    {
        key: 'value',
        displayName: 'Value',
        isSticky: false,
        valueMapper: (element) => element.value + '$',
        align: 'start',
    },
    {
        key: 'valuePerHour',
        displayName: 'Value per hour',
        isSticky: false,
        valueMapper: (element) => element.valuePerHour,
        align: 'end',
    },
    {
        key: 'apy',
        displayName: 'APY',
        isSticky: false,
        valueMapper: (element) => element.apy,
        align: 'end',
    },
    {
        key: 'share',
        displayName: 'Share',
        isSticky: false,
        valueMapper: (element) => element.share,
        align: 'end',
    },
    {
        key: 'cut',
        displayName: 'Cut',
        isSticky: false,
        valueMapper: (element) => element.cut,
        align: 'end',
    },
    {
        key: 'bounties',
        displayName: 'Bounties',
        isSticky: false,
        valueMapper: (element) => element.bounties,
        align: 'end',
    },
    {
        key: 'totalStake',
        displayName: 'Total Stake',
        isSticky: false,
        valueMapper: (element) => element.totalStake,
        align: 'end',
    },
]

const actions: ScrollTableAction<SomeElement>[] = [
    {
        displayName: 'Add',
        callback: action('Add CLICKED'),
    },
    {
        displayName: 'Edit',
        callback: action('Edit CLICKED'),
    },
]

export const Basic = () => {
    return (
        <ScrollTable
            title="This is a cool table!"
            elements={elements}
            columns={columns}
        />
    )
}

export const WithActions = () => {
    return (
        <ScrollTable
            title="This is a cool table!"
            elements={elements}
            columns={columns}
            actions={actions}
        />
    )
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/ScrollTable',
    component: Basic,
    decorators: [
        (Story) => {
            return (
                <Container>
                    <Story />
                </Container>
            )
        },
    ],
}

export default meta
