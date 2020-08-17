// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { withKnobs } from '@storybook/addon-knobs'

import StatusIcon from '.'

const stories =
    storiesOf('Shared/StatusIcon', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem 10rem',
        }))
        .addDecorator(withKnobs)

stories.add('default', () => <StatusIcon />)
stories.add('ok', () => <StatusIcon status={StatusIcon.OK} />)
stories.add('ok with tooltip', () => <StatusIcon tooltip status={StatusIcon.OK} />)
stories.add('inactive', () => <StatusIcon status={StatusIcon.INACTIVE} />)
stories.add('inactive with tooltip', () => <StatusIcon tooltip status={StatusIcon.INACTIVE} />)
stories.add('error', () => <StatusIcon status={StatusIcon.ERROR} />)
stories.add('error with tooltip', () => <StatusIcon tooltip status={StatusIcon.ERROR} />)
stories.add('removed', () => <StatusIcon status={StatusIcon.REMOVED} />)
stories.add('removed with tooltip', () => <StatusIcon tooltip status={StatusIcon.REMOVED} />)
stories.add('custom tooltip', () => <StatusIcon tooltip="This is a custom tooltip" status={StatusIcon.OK} />)
