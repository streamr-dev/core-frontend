import React from 'react'
import { action } from '@storybook/addon-actions'
import {Meta} from "@storybook/react"
import styled from 'styled-components'
import { MD, LG } from '$shared/utils/styled'
import NetworkIcon from '$shared/components/NetworkIcon'
import ChainSelector from '.'

const Container = styled.div`
    padding: 0;

    @media (min-width: ${MD}px) {
        padding: 1rem 1.5rem;
    }

    @media (min-width: ${LG}px) {
        padding: 3rem 5rem;
    }
`
const chainOptions = [
    {
        id: 1,
        name: 'Ethereum',
        icon: <NetworkIcon chainId={1} />,
    },
    {
        id: 100,
        name: 'Gnosis',
        icon: <NetworkIcon chainId={100} />,
    },
    {
        id: 137,
        name: 'Polygon',
        icon: <NetworkIcon chainId={137} />,
    },
]

const Component = () => (
    <Container>
        <ChainSelector
            chains={chainOptions}
            onChainSelected={(nextChainId) => action(`Chain selected ${nextChainId}`)}
            disabled={false}
        />
    </Container>
)

export const Default = () => <Component />

const meta: Meta<typeof Default> = {
    title: 'Shared/ChainSelector',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            fontSize: '16px',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

Default.story = {
    name: 'default',
}

export const DefaultTablet = () => <Component />

DefaultTablet.story = {
    name: 'default (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const DefaultMobile = () => <Component />

DefaultMobile.story = {
    name: 'default (mobile)',

    parameters: {
        viewport: {
            defaultViewport: 'xs',
        },
    },
}
