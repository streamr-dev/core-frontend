// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import StoryRouter from 'storybook-react-router'

import TOCPage from '.'

const stories =
    storiesOf('Userpages/TOCPage', module)
        .addDecorator(StoryRouter())
        .addDecorator(styles({
            padding: '2rem',
            color: 'black',
        }))
        .addDecorator(withKnobs)

stories.add('basic', () => {
    const showLinkTitle = boolean('Use different link title', false)

    return (
        <TOCPage title={boolean('Include Page title', true) && text('Page title', 'Page Title')}>
            <TOCPage.Section
                title={text('First section title', 'First Section')}
                linkTitle={showLinkTitle && text('First section link', 'First')}
            >
                Use the knobs section to control the page content.
            </TOCPage.Section>
            <TOCPage.Section
                title={text('Second section title', 'Second Section')}
                linkTitle={showLinkTitle && text('Second section link', 'Second')}
            >
                Content goes here
            </TOCPage.Section>
        </TOCPage>
    )
})
