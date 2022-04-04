// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'

import { MD, LG } from '$shared/utils/styled'
import NetworkIcon from '$shared/components/NetworkIcon'

import ChainSelector from '.'

const stories = storiesOf('Shared/ChainSelector', module)
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

const chainOptions = [{
    id: 1,
    name: 'Ethereum',
    icon: <NetworkIcon chainId={1} />,
}, {
    id: 100,
    name: 'Gnosis Chain',
    icon: <NetworkIcon chainId={100} />,
}, {
    id: 137,
    name: 'Polygon',
    icon: <NetworkIcon chainId={137} />,
}]

const Component = () => (
    <Container>
        <ChainSelector
            chains={chainOptions}
            onChainSelected={(nextChainId) => action(`Chain selected ${nextChainId}`)}
            disabled={false}
        />
    </Container>
)

stories.add('default', () => (
    <Component />
))

stories.add('default (tablet)', () => (
    <Component />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('default (mobile)', () => (
    <Component />
), {
    viewport: {
        defaultViewport: 'xs',
    },
})
