import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import StoryRouter from 'storybook-react-router'
import TOCSection from './TOCSection'
import TOCPage from '.'
const stories = storiesOf('Shared/TOCPage', module)
    .addDecorator(StoryRouter())
    .addDecorator(
        styles({
            padding: '2rem',
            color: 'black',
        }),
    )
    .addDecorator(withKnobs)
stories.add('basic', () => {
    const showLinkTitle = boolean('Use different link title', false)
    return (
        <TOCPage title={boolean('Include Page title', true) && text('Page title', 'Page Title')}>
            <TOCSection
                id="first"
                title={text('First section title', 'First Section')}
                linkTitle={showLinkTitle && text('First section link', 'First')}
            >
                Use the knobs section to control the page content.
            </TOCSection>
            <TOCSection
                id="second"
                title={text('Second section title', 'Second Section')}
                linkTitle={showLinkTitle && text('Second section link', 'Second')}
            >
                Content goes here
            </TOCSection>
        </TOCPage>
    )
})
