// @flow

import React, { useState, useCallback, useMemo } from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import sortBy from 'lodash/sortBy'
import { StatusIcon } from '@streamr/streamr-layout'

import { MD, LG } from '$shared/utils/styled'
import Meatball from '$shared/components/Meatball'

import {
    List,
    StreamList as StreamListComponent,
    MemberList as MemberListComponent,
    TransactionList as TransactionListComponent,
} from '.'

const stories = storiesOf('Shared/List', module)
    .addDecorator(styles({
        color: '#323232',
        fontSize: '16px',
    }))

const Container = styled.div`
    padding: 0;

    @media (min-width: ${MD}px) {
        padding: 1rem 1.5rem;
    }

    @media (min-width: ${LG}px) {
        padding: 3rem 5rem;
    }
`

const defaultList = [{
    id: '1',
    title: 'Title for the item',
    description: 'Short description',
    updated: '4 days ago',
    lastData: '1 second ago',
    status: StatusIcon.ERROR,
}, {
    id: '2',
    title: 'Just the title',
    description: '',
    updated: '',
    lastData: '',
    status: StatusIcon.OK,
}, {
    id: '3',
    title: 'Title for the item that is really long and will break the layout if it goes long enough over the screen',
    description: 'Description that is really long and will break the layout if it goes long enough over the screen',
    updated: 'a week ago',
    lastData: '1 weeek ago',
    status: StatusIcon.INACTIVE,
}]

const DefaultList = () => (
    <Container>
        <List>
            <List.Header>
                <List.HeaderItem>Title</List.HeaderItem>
                <List.HeaderItem>Description</List.HeaderItem>
                <List.HeaderItem>Updated</List.HeaderItem>
                <List.HeaderItem>Last Data</List.HeaderItem>
                <List.HeaderItem center>Status</List.HeaderItem>
            </List.Header>
            {defaultList.map(({
                id,
                title,
                description,
                updated,
                lastData,
                status,
            }) => (
                <List.Row
                    id={id}
                    key={id}
                    onClick={action('onClick')}
                >
                    <List.Title
                        description={description}
                        moreInfo={lastData}
                    >
                        {title}
                    </List.Title>
                    <List.Item truncate>{description}</List.Item>
                    <List.Item>{updated}</List.Item>
                    <List.Item>{lastData}</List.Item>
                    <List.Item center>
                        <StatusIcon status={status} tooltip />
                    </List.Item>
                </List.Row>
            ))}
        </List>
    </Container>
)

stories.add('default', () => (
    <DefaultList />
))

stories.add('default (tablet)', () => (
    <DefaultList />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('default (mobile)', () => (
    <DefaultList />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})

const sortOptions = {
    nameAsc: {
        column: 'title',
        order: 'asc',
    },
    nameDesc: {
        column: 'title',
        order: 'desc',
    },
    descAsc: {
        column: 'description',
        order: 'asc',
    },
    descDesc: {
        column: 'description',
        order: 'desc',
    },
    statusAsc: {
        column: 'status',
        order: 'asc',
    },
    statusDesc: {
        column: 'status',
        order: 'desc',
    },
}

const SortableList = () => {
    const [sort, setSort] = useState(undefined)
    const sortedList = useMemo(() => {
        if (!sort) {
            return defaultList
        }

        const { column, order } = sortOptions[sort]
        const sorted = sortBy(defaultList, column)

        return order === 'desc' ? sorted.reverse() : sorted
    }, [sort])

    const onHeaderSortUpdate = useCallback((asc, desc) => {
        setSort((prevFilter) => {
            let nextSort

            if (![asc, desc].includes(prevFilter)) {
                nextSort = asc
            } else if (prevFilter === asc) {
                nextSort = desc
            }

            return nextSort
        })
    }, [setSort])

    return (
        <Container>
            <List>
                <List.Header>
                    <List.HeaderItem
                        asc="nameAsc"
                        desc="nameDesc"
                        active={sort}
                        onClick={onHeaderSortUpdate}
                    >
                        Title
                    </List.HeaderItem>
                    <List.HeaderItem
                        asc="descAsc"
                        desc="descDesc"
                        active={sort}
                        onClick={onHeaderSortUpdate}
                    >
                        Description
                    </List.HeaderItem>
                    <List.HeaderItem>Updated</List.HeaderItem>
                    <List.HeaderItem>Last Data</List.HeaderItem>
                    <List.HeaderItem
                        center
                        asc="statusAsc"
                        desc="statusDesc"
                        active={sort}
                        onClick={onHeaderSortUpdate}
                    >
                        Status
                    </List.HeaderItem>
                </List.Header>
                {sortedList.map(({
                    id,
                    title,
                    description,
                    updated,
                    lastData,
                    status,
                }) => (
                    <List.Row
                        id={id}
                        key={id}
                        onClick={action('onClick')}
                    >
                        <List.Title
                            description={description}
                            moreInfo={lastData}
                        >
                            {title}
                        </List.Title>
                        <List.Item truncate>{description}</List.Item>
                        <List.Item>{updated}</List.Item>
                        <List.Item>{lastData}</List.Item>
                        <List.Item center>
                            <StatusIcon status={status} tooltip />
                        </List.Item>
                    </List.Row>
                ))}
            </List>
        </Container>
    )
}

stories.add('sortable columns', () => (
    <SortableList />
))

const selectableList = [{
    id: '1',
    title: 'Item 1',
    description: 'Description 1',
    time: '1 day ago',
}, {
    id: '2',
    title: 'Item 2',
    description: 'Description 2',
    time: '2 day ago',
}, {
    id: '3',
    title: 'Item 3',
    description: 'Description 3',
    time: '3 day ago',
}]

const SelectableList = () => {
    const [selected, setSelected] = useState(new Set([]))

    const onSelect = useCallback((id) => {
        setSelected((prevSelected) => {
            if (prevSelected.has(id)) {
                prevSelected.delete(id)
                return new Set([...prevSelected])
            }

            return new Set([...prevSelected, id])
        })
    }, [])

    return (
        <Container>
            <List>
                <List.Header>
                    <List.HeaderItem>Title</List.HeaderItem>
                    <List.HeaderItem>Description</List.HeaderItem>
                    <List.HeaderItem>Updated</List.HeaderItem>
                </List.Header>
                {selectableList.map(({ id, title, description, time }) => (
                    <List.Row
                        selectable
                        active={selected.has(id)}
                        onClick={onSelect}
                        key={id}
                        id={id}
                    >
                        <List.Title
                            description={description}
                            moreInfo={time}
                        >
                            {title}
                        </List.Title>
                        <List.Item>{description}</List.Item>
                        <List.Item>{time}</List.Item>
                    </List.Row>
                ))}
            </List>
        </Container>
    )
}

stories.add('selectable', () => (
    <SelectableList selectable />
))

stories.add('selectable (tablet)', () => (
    <SelectableList selectable />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('selectable (mobile)', () => (
    <SelectableList selectable />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})

const streamList = [{
    id: 'sandbox/coffee-machine',
    description: 'Live updates from my coffee machine',
    updated: '',
    lastData: '4 days ago',
    status: StatusIcon.OK,
}, {
    id: 'sandbox/dataUnion/21aec220f1c0460798828211aa3070f265e261dd9e474405824f6379af7849df',
    description: 'Automatically created JoinPart stream for data union',
    updated: '1 week ago',
    lastData: '2 minutes ago',
    status: StatusIcon.ERROR,
}]

const StreamList = () => (
    <Container>
        <StreamListComponent>
            <List.Header>
                <List.HeaderItem>Name</List.HeaderItem>
                <List.HeaderItem>Description</List.HeaderItem>
                <List.HeaderItem>Updated</List.HeaderItem>
                <List.HeaderItem>Last Data</List.HeaderItem>
                <List.HeaderItem center>Status</List.HeaderItem>
                <List.HeaderItem />
            </List.Header>
            {streamList.map(({
                id,
                description,
                updated,
                lastData,
                status,
            }) => (
                <List.Row id={id} key={id} onClick={action('onClick')}>
                    <List.Title
                        description={description}
                        moreInfo={lastData}
                    >
                        {id}
                    </List.Title>
                    <List.Item truncate>{description}</List.Item>
                    <List.Item>{updated}</List.Item>
                    <List.Item>{lastData}</List.Item>
                    <List.Item center>
                        <StatusIcon status={status} tooltip />
                    </List.Item>
                    <List.Actions>
                        <Meatball alt="actions" />
                    </List.Actions>
                </List.Row>
            ))}
        </StreamListComponent>
    </Container>
)

stories.add('streams', () => (
    <StreamList />
))

stories.add('streams (tablet)', () => (
    <StreamList />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('streams (mobile)', () => (
    <StreamList />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})

const memberList = [{
    id: '1',
    address: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
    joined: 'An hour ago',
    lastUpdated: 'An hour ago',
    status: StatusIcon.PENDING,
}, {
    id: '2',
    address: '0x538a2Fa87E03B280e10C83AA8dD7E5B15B868BD9',
    joined: '2 hours ago',
    lastUpdated: 'An hour ago',
    status: StatusIcon.PENDING,
}, {
    id: '3',
    address: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
    joined: '1 day ago',
    lastUpdated: '1 day ago',
    status: StatusIcon.OK,
}]

const MemberList = () => {
    const [selected, setSelected] = useState(new Set([]))

    const onSelect = useCallback((id) => {
        setSelected((prevSelected) => {
            if (prevSelected.has(id)) {
                prevSelected.delete(id)
                return new Set([...prevSelected])
            }

            return new Set([...prevSelected, id])
        })
    }, [])

    return (
        <Container>
            <MemberListComponent>
                <List.Header>
                    <List.HeaderItem>Ethereum address</List.HeaderItem>
                    <List.HeaderItem>Joined / requested</List.HeaderItem>
                    <List.HeaderItem>Last updated</List.HeaderItem>
                    <List.HeaderItem center>Status</List.HeaderItem>
                </List.Header>
                {memberList.map(({
                    id,
                    address,
                    joined,
                    lastUpdated,
                    status,
                }) => (
                    <List.Row
                        selectable
                        active={selected.has(id)}
                        onClick={onSelect}
                        id={id}
                        key={id}
                    >
                        <List.Title
                            description={`Last updated: ${joined}`}
                            moreInfo={lastUpdated}
                        >
                            {address}
                        </List.Title>
                        <List.Item>{joined}</List.Item>
                        <List.Item>{lastUpdated}</List.Item>
                        <List.Item center>
                            <StatusIcon status={status} tooltip />
                        </List.Item>
                    </List.Row>
                ))}
            </MemberListComponent>
        </Container>
    )
}

stories.add('members', () => (
    <MemberList />
))

stories.add('members (tablet)', () => (
    <MemberList />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('members (mobile)', () => (
    <MemberList />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})

const transactions = [{
    id: '1',
    title: 'Data Product',
    type: 'Payment',
    hash: '0xda3f...497863',
    when: '2 months ago',
    value: '+1.05 DATA',
    gas: '186347 / 500000',
    status: StatusIcon.OK,
}]

const TransactionList = () => (
    <Container>
        <TransactionListComponent>
            <List.Header>
                <List.HeaderItem>Name</List.HeaderItem>
                <List.HeaderItem>Type</List.HeaderItem>
                <List.HeaderItem>Transaction</List.HeaderItem>
                <List.HeaderItem>When</List.HeaderItem>
                <List.HeaderItem>Value</List.HeaderItem>
                <List.HeaderItem>Gas</List.HeaderItem>
                <List.HeaderItem center>Status</List.HeaderItem>
                <List.HeaderItem />
            </List.Header>
            {transactions.map(({
                id,
                title,
                type,
                hash,
                when,
                value,
                gas,
                status,
            }) => (
                <List.Row id={id} key={id} onClick={action('onClick')}>
                    <List.Title
                        description={`${type} ${value} (gas: ${gas})`}
                        moreInfo={when}
                    >
                        {title}
                    </List.Title>
                    <List.Item>{type}</List.Item>
                    <List.Item>{hash}</List.Item>
                    <List.Item>{when}</List.Item>
                    <List.Item>{value}</List.Item>
                    <List.Item>{gas}</List.Item>
                    <List.Item center>
                        <StatusIcon status={status} tooltip />
                    </List.Item>
                    <List.Actions>
                        <Meatball alt="actions" />
                    </List.Actions>
                </List.Row>
            ))}
        </TransactionListComponent>
    </Container>
)

stories.add('transactions', () => (
    <TransactionList />
))

stories.add('transactions (tablet)', () => (
    <TransactionList />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('transactions (mobile)', () => (
    <TransactionList />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})
