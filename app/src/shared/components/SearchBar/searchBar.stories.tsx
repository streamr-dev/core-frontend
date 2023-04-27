import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import SearchBar from '.'
const stories = storiesOf('Shared/SearchBar', module).addDecorator(
    styles({
        padding: '2rem',
    }),
)
stories.add('default', () => (
    <SearchBar
        onChange={action('inputChange')}
    />
))

stories.add('custom placeholder', () => (
    <SearchBar
        placeholder={'Enter a phrase and try to search for something'}
        onChange={action('inputChange')}
    />
))
