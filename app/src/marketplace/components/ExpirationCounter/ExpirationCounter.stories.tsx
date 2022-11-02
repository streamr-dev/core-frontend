import React from 'react'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import ExpirationCounter from '.'
const now = Date.now() // Use `undefined` to unfreeze time here!

storiesOf('Marketplace/ExpirationCounter', module)
    .addDecorator(StoryRouter())
    .add('more than a day', () => (
        <ExpirationCounter now={now} expiresAt={new Date((now || Date.now()) + 2 * 24 * 60 * 60 * 1000)} />
    ))
    .add('less than hour', () => (
        <ExpirationCounter now={now} expiresAt={new Date((now || Date.now()) + 1 * 60 * 1000)} />
    ))
    .add('less than a day', () => (
        <ExpirationCounter now={now} expiresAt={new Date((now || Date.now()) + 20 * 60 * 60 * 1000)} />
    ))
    .add('expired', () => (
        <ExpirationCounter now={now} expiresAt={new Date((now || Date.now()) - 60 * 60 * 1000)} />
    ))
