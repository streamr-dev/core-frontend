// $flow

import React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'

import store from './utils/i18nStore'

import TOCPage from '$userpages/components/TOCPage'

const story = (name) => storiesOf(`UserPages/${name}`, module)
    .addDecorator(StoryRouter())
    .addDecorator(styles({
        padding: '15px',
        color: 'black',
    }))
    .addDecorator((callback) => (<Provider store={store}>{callback()}</Provider>))

story('TOCPage')
    .addWithJSX('basic', () => (
        <TOCPage title="Page Title">
            <TOCPage.Section id="first" title="First Section">
                Content goes here
            </TOCPage.Section>
            <TOCPage.Section id="second" title="Second Section">
                Content goes here
            </TOCPage.Section>
        </TOCPage>
    ))
    .addWithJSX('without page title', () => (
        <TOCPage>
            <TOCPage.Section id="first" title="First Section">
                Content goes here
            </TOCPage.Section>
            <TOCPage.Section id="second" title="Second Section">
                Content goes here
            </TOCPage.Section>
        </TOCPage>
    ))
    .addWithJSX('different menu title', () => (
        <TOCPage title="Page Title">
            <TOCPage.Section id="first" title="First Section" linkTitle="First">
                Content goes here
            </TOCPage.Section>
            <TOCPage.Section id="second" title="Second Section" linkTitle="Second">
                Content goes here
            </TOCPage.Section>
        </TOCPage>
    ))
