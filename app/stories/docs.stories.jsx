/* eslint-disable react/no-multi-comp */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-react-router'
import styles from '@sambego/storybook-styles'

import Navigation from '$docs/components/DocsLayout/Navigation'
import PageTurner from '$docs/components/PageTurner'

import docsStyles from '$docs/components/DocsLayout/docsLayout.pcss'

const story = (name) => storiesOf(`Docs/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
        padding: '15px',
    }))
    .addDecorator(withKnobs)

story('Navigation')
    .addDecorator(StoryRouter())
    .addWithJSX('desktop', () => (
        <div>
            <span style={
                {
                    color: 'green',
                }
            }
            >
            * Only visible in Desktop resolution
            </span>
            <Navigation />
        </div>
    ))
    .addWithJSX('mobile', () => (
        <div>
            <span style={
                {
                    color: 'green',
                }
            }
            >
            * Only visible in mobile/table resolution
            </span>
            <Navigation responsive />
        </div>
    ))

story('PageTurner')
    .addDecorator(StoryRouter())
    .addWithJSX('PageTurner', () => (
        <div className={docsStyles.docsLayout}>
            <PageTurner />
        </div>
    ))
