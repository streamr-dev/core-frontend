import React, { HTMLAttributes, useState } from 'react'
import { storiesOf } from '@storybook/react'
import { Link, MemoryRouter } from 'react-router-dom'
import styles from '@sambego/storybook-styles'
import Tabs, { Tab } from './Tabs'

const stories = storiesOf('Shared/Tabs', module).addDecorator(
    styles({
        padding: '2rem',
        color: '#000',
    }),
)

function Container({
    title,
    children,
    ...props
}: { title: string } & Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'>) {
    return (
        <MemoryRouter>
            <div {...props} style={{ marginTop: '32px' }}>
                <p style={{ textTransform: 'uppercase' }}>
                    <span style={{ marginRight: '8px' }}>&rarr;</span> {title}
                </p>
                {children}
            </div>
        </MemoryRouter>
    )
}

function Stateful({
    initialValue,
    children,
}: {
    initialValue: string
    children: (value: string, setValue: (newValue: string) => void) => JSX.Element
}) {
    const [value, setValue] = useState(initialValue)

    return children(value, setValue)
}

stories.add('all', () => (
    <>
        <Container title="Nothing selected">
            <Tabs>
                <Tab id="overview">Overview</Tab>
                <Tab id="connect">Connect</Tab>
                <Tab id="liveData">Live data</Tab>
            </Tabs>
        </Container>
        <Container title="All disabled">
            <Tabs>
                <Tab disabled id="overview">
                    Overview
                </Tab>
                <Tab disabled id="connect">
                    Connect
                </Tab>
                <Tab disabled id="liveData">
                    Live data
                </Tab>
            </Tabs>
        </Container>
        <Container title="Some disabled">
            <Tabs>
                <Tab id="overview">Overview</Tab>
                <Tab disabled id="connect">
                    Connect
                </Tab>
                <Tab id="liveData">Live data</Tab>
            </Tabs>
        </Container>
        <Container title="With selection">
            <Stateful initialValue="connect">
                {(value, setValue) => (
                    <Tabs selectedId={value} onSelectionChange={setValue}>
                        <Tab tag={Link} to="/overview" id="overview">
                            Entity overview
                        </Tab>
                        <Tab tag={Link} to="/connect" id="connect">
                            Connect
                        </Tab>
                        <Tab disabled id="liveData">
                            Live data
                        </Tab>
                        <Tab id="lorem">Lorem ipsum dolor sit emat</Tab>
                    </Tabs>
                )}
            </Stateful>
        </Container>
        <Container title="With selection and items spread evenly">
            <Stateful initialValue="connect">
                {(value, setValue) => (
                    <Tabs selectedId={value} onSelectionChange={setValue} spreadEvenly>
                        <Tab tag={Link} to="/overview" id="overview">
                            Entity overview
                        </Tab>
                        <Tab tag={Link} to="/connect" id="connect">
                            Connect
                        </Tab>
                        <Tab disabled id="liveData">
                            Live data
                        </Tab>
                        <Tab id="lorem">Lorem ipsum dolor sit emat</Tab>
                    </Tabs>
                )}
            </Stateful>
        </Container>
        <Container title="Full width with selection and items spread evenly">
            <Stateful initialValue="connect">
                {(value, setValue) => (
                    <Tabs
                        selectedId={value}
                        onSelectionChange={setValue}
                        spreadEvenly
                        style={{ width: '100%' }}
                    >
                        <Tab tag={Link} to="/overview" id="overview">
                            Entity overview
                        </Tab>
                        <Tab tag={Link} to="/connect" id="connect">
                            Connect
                        </Tab>
                        <Tab disabled id="liveData">
                            Live data
                        </Tab>
                        <Tab id="lorem">Lorem ipsum dolor sit emat</Tab>
                    </Tabs>
                )}
            </Stateful>
        </Container>
    </>
))
