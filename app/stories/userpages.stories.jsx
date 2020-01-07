// @flow

import React from 'react'
import { Provider } from 'react-redux'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'

import styles from '@sambego/storybook-styles'

import store from './utils/i18nStore'

import TOCPage from '$userpages/components/TOCPage'
import Avatar from '$userpages/components/Avatar'

const story = (name) => storiesOf(`UserPages/${name}`, module)
    .addDecorator(StoryRouter())
    .addDecorator(styles({
        padding: '2rem',
        color: 'black',
    }))
    .addDecorator((callback) => (<Provider store={store}>{callback()}</Provider>))
    .addDecorator(withKnobs)

story('TOCPage')
    .addWithJSX('basic', () => {
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

story('Avatar')
    .addWithJSX('basic', () => {
        const user = {
            email: 'tester1@streamr.com',
            imageUrlLarge: boolean('showImage', true) ? 'https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg' : '',
            imageUrlSmall: '',
            name: text('Name', 'Matt Innes'),
            username: text('Username', 'matt@streamr.com'),
        }

        return (
            <Avatar
                editable={boolean('Editable', false)}
                user={user}
                onImageChange={() => Promise.resolve()}
            />
        )
    })
