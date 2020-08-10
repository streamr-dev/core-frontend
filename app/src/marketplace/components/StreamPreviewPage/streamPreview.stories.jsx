// @flow

import React, { useState, useCallback, useMemo } from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'

import StreamPreview from './StreamPreview'

const stories = storiesOf('Marketplace/StreamPreview', module)
    .addDecorator(styles({
        color: '#323232',
        fontSize: '16px',
        height: '100vh',
    }))

stories.add('default', () => (
    <StreamPreview />
))

stories.add('default (tablet)', () => (
    <StreamPreview />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('default (mobile)', () => (
    <StreamPreview />
), {
    viewport: {
        defaultViewport: 'iPhone',
    },
})
