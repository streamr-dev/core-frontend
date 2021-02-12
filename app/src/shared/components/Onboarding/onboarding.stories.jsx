// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import Link from '$shared/components/Link'
import Onboarding from '.'

const stories = storiesOf('Shared/Onboarding', module)

const onClick = (e) => {
    e.preventDefault()
}

stories.add('default', () => (
    <Onboarding title="Docs">
        <Link href="#" onClick={onClick}>Introduction</Link>
        <Link href="#" onClick={onClick}>Getting started</Link>
        <Link href="#" onClick={onClick}>Editor</Link>
        <Link href="#" onClick={onClick}>Engine</Link>
        <Link href="#" onClick={onClick}>Marketplace</Link>
        <Link href="#" onClick={onClick}>Streamr API</Link>
        {null}
        <Link href="#" onClick={onClick}>Discord</Link>
        <Link href="#" onClick={onClick}>Dev Chat</Link>
    </Onboarding>
))
