import React from 'react'
import { storiesOf } from '@storybook/react'
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
stories.add('basic', () => {
    const showLinkTitle = false
    return (
        <TOCPage title={text('Page title', 'Page Title')}>
            <TOCSection
                id="first"
                title={'First Section'}
                linkTitle={showLinkTitle && 'First'}
            >
                Use the knobs section to control the page content.
            </TOCSection>
            <TOCSection
                id="second"
                title={'Second Section'}
                linkTitle={showLinkTitle && 'Second'}
            >
                Content goes here
            </TOCSection>
        </TOCPage>
    )
})
