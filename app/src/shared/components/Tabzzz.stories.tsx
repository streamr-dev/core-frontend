import React, { HTMLAttributes, useState } from 'react'
import { storiesOf } from '@storybook/react'
import { Link, MemoryRouter } from 'react-router-dom'
import styles from '@sambego/storybook-styles'
import Tabzzz, { Tab } from './Tabzzz'

const stories = storiesOf('Shared/Tabzzz', module).addDecorator(
    styles({
        padding: '2rem',
        color: '#000',
    }),
)

function Container({ title, children, ...props }: { title: string } & Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'>) {
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
            <Tabzzz>
                <Tab id="overview">Overview</Tab>
                <Tab id="connect">Connect</Tab>
                <Tab id="liveData">Live data</Tab>
            </Tabzzz>
        </Container>
        <Container title="All disabled">
            <Tabzzz>
                <Tab disabled id="overview">
                    Overview
                </Tab>
                <Tab disabled id="connect">
                    Connect
                </Tab>
                <Tab disabled id="liveData">
                    Live data
                </Tab>
            </Tabzzz>
        </Container>
        <Container title="Some disabled">
            <Tabzzz>
                <Tab id="overview">Overview</Tab>
                <Tab disabled id="connect">
                    Connect
                </Tab>
                <Tab id="liveData">Live data</Tab>
            </Tabzzz>
        </Container>
        <Container title="With selection">
            <Stateful initialValue="connect">
                {(value, setValue) => (
                    <Tabzzz selectedId={value} onSelectionChange={setValue}>
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
                    </Tabzzz>
                )}
            </Stateful>
        </Container>
        <Container title="With selection and items spread evenly">
            <Stateful initialValue="connect">
                {(value, setValue) => (
                    <Tabzzz selectedId={value} onSelectionChange={setValue} spreadEvenly>
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
                    </Tabzzz>
                )}
            </Stateful>
        </Container>
        <Container title="Full width with selection and items spread evenly">
            <Stateful initialValue="connect">
                {(value, setValue) => (
                    <Tabzzz selectedId={value} onSelectionChange={setValue} spreadEvenly style={{ width: '100%' }}>
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
                    </Tabzzz>
                )}
            </Stateful>
        </Container>
    </>
))
