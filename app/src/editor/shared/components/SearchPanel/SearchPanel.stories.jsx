import React from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import { action } from '@storybook/addon-actions'
import UseState from '$shared/components/UseState'
import SearchPanel, { SearchRow } from './'

const stories =
    storiesOf('Editor/SearchPanel', module)
        .addDecorator(styles({
            height: '100vh',
            width: '100%',
            backgroundColor: '#E7E7E7',
            color: '#323232',
            padding: '5rem',
        }))

stories.add('One Child', () => (
    <UseState initialValue>
        {(isOpen, setOpen) => (
            <SearchPanel
                isOpen={isOpen}
                open={() => setOpen(!isOpen)}
                placeholder="Placeholder Text"
                onChange={action('onChange')}
            >
                <SearchRow>Test</SearchRow>
            </SearchPanel>
        )}
    </UseState>
))

stories.add('Multiple Children', () => (
    <UseState initialValue>
        {(isOpen, setOpen) => (
            <SearchPanel
                isOpen={isOpen}
                open={() => setOpen(!isOpen)}
                onChange={action('onChange')}
            >
                <SearchRow>Test 1</SearchRow>
                <SearchRow>Test 2</SearchRow>
                <SearchRow>Test 3</SearchRow>
                <SearchRow>Test 4</SearchRow>
                <SearchRow>Test 5</SearchRow>
                <SearchRow>Test 6</SearchRow>
                <SearchRow>Test 7</SearchRow>
                <SearchRow>Test 8</SearchRow>
            </SearchPanel>
        )}
    </UseState>
))

stories.add('No Children', () => (
    <UseState initialValue>
        {(isOpen, setOpen) => (
            <SearchPanel
                isOpen={isOpen}
                open={() => setOpen(!isOpen)}
                onChange={action('onChange')}
            />
        )}
    </UseState>
))

stories.add('with renderDefault', () => (
    <UseState initialValue>
        {(isOpen, setOpen) => (
            <SearchPanel
                isOpen={isOpen}
                open={() => setOpen(!isOpen)}
                onChange={action('onChange')}
                renderDefault={() => <SearchRow>Default</SearchRow>}
            >
                <SearchRow>Test 1</SearchRow>
                <SearchRow>Test 2</SearchRow>
                <SearchRow>Test 3</SearchRow>
                <SearchRow>Test 4</SearchRow>
                <SearchRow>Test 5</SearchRow>
                <SearchRow>Test 6</SearchRow>
                <SearchRow>Test 7</SearchRow>
                <SearchRow>Test 8</SearchRow>
            </SearchPanel>
        )}
    </UseState>
))
