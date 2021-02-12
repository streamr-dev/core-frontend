/* eslint-disable react/no-multi-comp */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-react-router'
import styles from '@sambego/storybook-styles'

import Navigation from '$docs/components/DocsLayout/Navigation'
import PageTurner from '$docs/components/PageTurner'
import Search from '$docs/components/Search'

import docsStyles from '$docs/components/DocsLayout/docsLayout.pcss'

const story = (name) => storiesOf(`Docs/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
        padding: '15px',
    }))
    .addDecorator(withKnobs)

story('Search')
    .addDecorator(StoryRouter())
    .add('Search', () => (
        <Search />
    ))

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
            <Navigation.TableOfContents />
        </div>
    ))
    .add('mobile', () => (
        <div>
            <span style={
                {
                    color: 'green',
                }
            }
            >
                * Only visible in mobile/table resolution
            </span>
            <Navigation.Responsive />
        </div>
    ), {
        viewport: {
            defaultViewport: 'xs',
        },
    })

story('PageTurner')
    .addDecorator(StoryRouter())
    .addWithJSX('PageTurner', () => (
        <div className={docsStyles.docsLayout}>
            <PageTurner />
        </div>
    ))
