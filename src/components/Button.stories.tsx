import React, { Fragment } from 'react'
import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import styled, { css } from 'styled-components'
import { Button } from './Button'

const Container = styled.div<{ gray?: boolean; header?: boolean }>`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 0 32px;
    padding: 0 32px;
    width: 100%;

    & + & {
        margin-top: 32px;
    }

    ${({ gray = false }) =>
        !!gray &&
        css`
            background-color: #eeeeee;
            padding: 32px;
        `}

    ${({ header = false }) =>
        !!header &&
        css`
            border-bottom: 1px solid #cdcdcd;
            font-size: 12px;
            text-transform: uppercase;
        `}
`

export const All = () => (
    <Fragment>
        <Container header>
            <strong>Normal button</strong>
            <strong>Disabled button</strong>
            <strong>Normal link</strong>
            <strong>Disabled link</strong>
        </Container>
        <Container>
            <div>
                <Button kind="primary" size="mini" onClick={action('Clicked')}>
                    Primary mini
                </Button>
            </div>
            <div>
                <Button kind="primary" size="mini" onClick={action('Clicked')} disabled>
                    Primary mini
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="mini"
                    onClick={action('Clicked')}
                >
                    Primary mini
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="mini"
                    onClick={action('Clicked')}
                    disabled
                >
                    Primary mini
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="primary" size="normal" onClick={action('Clicked')}>
                    Primary normal
                </Button>
            </div>
            <div>
                <Button kind="primary" size="normal" onClick={action('Clicked')} disabled>
                    Primary normal
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="normal"
                    onClick={action('Clicked')}
                >
                    Primary normal
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="normal"
                    onClick={action('Clicked')}
                    disabled
                >
                    Primary normal
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="primary" size="big" onClick={action('Clicked')}>
                    Primary big
                </Button>
            </div>
            <div>
                <Button kind="primary" size="big" onClick={action('Clicked')} disabled>
                    Primary big
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="big"
                    onClick={action('Clicked')}
                >
                    Primary big
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="big"
                    onClick={action('Clicked')}
                    disabled
                >
                    Primary big
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="primary" size="normal" outline onClick={action('Clicked')}>
                    Primary normal outline
                </Button>
            </div>
            <div>
                <Button
                    kind="primary"
                    size="normal"
                    outline
                    onClick={action('Clicked')}
                    disabled
                >
                    Primary normal outline
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="normal"
                    outline
                    onClick={action('Clicked')}
                >
                    Primary normal outline
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    size="normal"
                    outline
                    onClick={action('Clicked')}
                    disabled
                >
                    Primary normal outline
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="primary2" size="normal" onClick={action('Clicked')}>
                    Primary2
                </Button>
            </div>
            <div>
                <Button
                    kind="primary2"
                    size="normal"
                    onClick={action('Clicked')}
                    disabled
                >
                    Primary2
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary2"
                    size="normal"
                    onClick={action('Clicked')}
                >
                    Primary2
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary2"
                    size="normal"
                    onClick={action('Clicked')}
                    disabled
                >
                    Primary2
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="transparent" size="normal" onClick={action('Clicked')}>
                    Transparent
                </Button>
            </div>
            <div>
                <Button
                    kind="transparent"
                    size="normal"
                    onClick={action('Clicked')}
                    disabled
                >
                    Transparent
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="transparent"
                    size="normal"
                    onClick={action('Clicked')}
                >
                    Transparent
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="transparent"
                    size="normal"
                    onClick={action('Clicked')}
                    disabled
                >
                    Transparent
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="secondary" size="mini" onClick={action('Clicked')}>
                    Secondary mini
                </Button>
            </div>
            <div>
                <Button kind="secondary" size="mini" onClick={action('Clicked')} disabled>
                    Secondary mini
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="mini"
                    onClick={action('Clicked')}
                >
                    Secondary mini
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="mini"
                    onClick={action('Clicked')}
                    disabled
                >
                    Secondary mini
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="secondary" size="normal" onClick={action('Clicked')}>
                    Secondary normal
                </Button>
            </div>
            <div>
                <Button
                    kind="secondary"
                    size="normal"
                    onClick={action('Clicked')}
                    disabled
                >
                    Secondary normal
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="normal"
                    onClick={action('Clicked')}
                >
                    Secondary normal
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="normal"
                    onClick={action('Clicked')}
                    disabled
                >
                    Secondary normal
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="secondary" size="big" onClick={action('Clicked')}>
                    Secondary big
                </Button>
            </div>
            <div>
                <Button kind="secondary" size="big" onClick={action('Clicked')} disabled>
                    Secondary big
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="big"
                    onClick={action('Clicked')}
                >
                    Secondary big
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="big"
                    onClick={action('Clicked')}
                    disabled
                >
                    Secondary big
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button
                    kind="secondary"
                    size="normal"
                    outline
                    onClick={action('Clicked')}
                >
                    Secondary normal outline
                </Button>
            </div>
            <div>
                <Button
                    kind="secondary"
                    size="normal"
                    outline
                    onClick={action('Clicked')}
                    disabled
                >
                    Secondary normal outline
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="normal"
                    outline
                    onClick={action('Clicked')}
                >
                    Secondary normal outline
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    size="normal"
                    outline
                    onClick={action('Clicked')}
                    disabled
                >
                    Secondary normal outline
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="destructive" onClick={action('Clicked')}>
                    Destructive
                </Button>
            </div>
            <div>
                <Button kind="destructive" onClick={action('Clicked')} disabled>
                    Destructive
                </Button>
            </div>
            <div>
                <Button tag="a" href="/" kind="destructive" onClick={action('Clicked')}>
                    Destructive
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="destructive"
                    onClick={action('Clicked')}
                    disabled
                >
                    Destructive
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="link" variant="dark" onClick={action('Clicked')}>
                    Link (dark)
                </Button>
            </div>
            <div>
                <Button kind="link" variant="dark" onClick={action('Clicked')} disabled>
                    Link (dark)
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="link"
                    variant="dark"
                    onClick={action('Clicked')}
                >
                    Link (dark)
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="link"
                    variant="dark"
                    onClick={action('Clicked')}
                    disabled
                >
                    Link (dark)
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="link" variant="light" onClick={action('Clicked')}>
                    Link (light)
                </Button>
            </div>
            <div>
                <Button kind="link" variant="light" onClick={action('Clicked')} disabled>
                    Link (light)
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="link"
                    variant="light"
                    onClick={action('Clicked')}
                >
                    Link (light)
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="link"
                    variant="light"
                    onClick={action('Clicked')}
                    disabled
                >
                    Link (light)
                </Button>
            </div>
        </Container>
        <Container gray>
            <div>
                <Button kind="special" variant="light" onClick={action('Clicked')}>
                    Special (light)
                </Button>
            </div>
            <div>
                <Button
                    kind="special"
                    variant="light"
                    onClick={action('Clicked')}
                    disabled
                >
                    Special (light)
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="special"
                    variant="light"
                    onClick={action('Clicked')}
                >
                    Special (light)
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="special"
                    variant="light"
                    onClick={action('Clicked')}
                    disabled
                >
                    Special (light)
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="primary" waiting onClick={action('Clicked')}>
                    Waiting primary
                </Button>
            </div>
            <div>
                <Button kind="primary" waiting onClick={action('Clicked')} disabled>
                    Waiting primary
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    waiting
                    onClick={action('Clicked')}
                >
                    Waiting primary
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="primary"
                    waiting
                    onClick={action('Clicked')}
                    disabled
                >
                    Waiting primary
                </Button>
            </div>
        </Container>
        <Container>
            <div>
                <Button kind="secondary" waiting onClick={action('Clicked')}>
                    Waiting secondary
                </Button>
            </div>
            <div>
                <Button kind="secondary" waiting onClick={action('Clicked')} disabled>
                    Waiting secondary
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    waiting
                    onClick={action('Clicked')}
                >
                    Waiting secondary
                </Button>
            </div>
            <div>
                <Button
                    tag="a"
                    href="/"
                    kind="secondary"
                    waiting
                    onClick={action('Clicked')}
                    disabled
                >
                    Waiting secondary
                </Button>
            </div>
        </Container>
    </Fragment>
)

All.story = {
    name: 'all',
}

const meta: Meta<typeof All> = {
    title: 'Shared/Button2',
    component: All,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '32px 0',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
