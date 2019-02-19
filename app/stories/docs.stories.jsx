/* eslint-disable react/no-multi-comp */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-react-router'
import styles from '@sambego/storybook-styles'
import links from '$shared/../links'

import Navigation from '$docs/components/DocsLayout/Navigation'
import PageTurner from '$docs/components/PageTurner'

import docsStyles from '$docs/components/DocsLayout/docsLayout.pcss'

const story = (name) => storiesOf(`Docs/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
        padding: '15px',
    }))
    .addDecorator(withKnobs)

const navigationItems = {
    Introduction: links.docs.introduction,
    'Getting Started': links.docs.main,
    Tutorials: links.docs.tutorials,
    'Visual Editor': links.docs.visualEditor,
    'Streamr Engine': links.docs.streamrEngine,
    Marketplace: links.docs.dataMarketplace,
    'Streamr APIs': links.docs.api,
}

const subNavigationItems = {
    'streamr-tech-stack': 'Streamr Tech Stack',
    'realtime-engine': 'Realtime Engine',
}

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
            <Navigation navigationItems={navigationItems} subNavigationItems={subNavigationItems} />
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
            <Navigation responsive navigationItems={navigationItems} />
        </div>
    ))

story('PageTurner')
    .addDecorator(StoryRouter())
    .addWithJSX('PageTurner', () => (
        <div className={docsStyles.docsLayout}>
            <PageTurner navigationItems={navigationItems} />
        </div>
    ))
