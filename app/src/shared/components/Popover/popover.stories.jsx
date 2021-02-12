// @flow

import React, { useState, useCallback } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'

import Popover from '.'

const Container = styled.div`
    display: inline-block;
`

const stories =
    storiesOf('Shared/Popover', module)
        .addDecorator(styles({
            padding: '2rem 12rem',
            color: 'white',
        }))
        .addDecorator((callback) => (<Container>{callback()}</Container>))

stories.add('basic', () => (
    <Popover title="Select">
        <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
        <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
    </Popover>
))

stories.add('basic (right menu align)', () => (
    <Popover
        title="Select"
        menuProps={{
            right: true,
        }}
    >
        <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
        <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
    </Popover>
))

stories.add('basic (svg caret)', () => (
    <Popover title="Select" caret="svg">
        <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
        <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
    </Popover>
))

stories.add('uppercase', () => (
    <Popover
        title="Select"
        type="uppercase"
        caret="svg"
        menuProps={{
            right: true,
        }}
    >
        <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
        <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
    </Popover>
))

stories.add('basic (no caret)', () => (
    <Popover title="Select" caret={false}>
        <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
        <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
    </Popover>
))

stories.add('meatball', () => (
    <Popover title="Select" caret={false} type="meatball">
        <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
        <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
    </Popover>
))

stories.add('meatball (gray)', () => (
    <Popover title="Select" caret={false} type="grayMeatball">
        <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
        <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
    </Popover>
))

const BlackPaddedContainer = styled.div`
    background: gray;
    padding: 1rem;
`

stories.add('meatball (white)', () => (
    <BlackPaddedContainer>
        <Popover title="Select" caret={false} type="whiteMeatball">
            <Popover.Item onClick={action('Click me')}>Click me</Popover.Item>
            <Popover.Item onClick={action('Another option')}>Another option</Popover.Item>
        </Popover>
    </BlackPaddedContainer>
))

stories.add('with value', () => (
    <Popover title="Select" onChange={action('onChange')}>
        <Popover.Item value="1">Value 1</Popover.Item>
        <Popover.Item value="2">Value 2</Popover.Item>
    </Popover>
))

type WithActiveItemProps = {
    activeTitle?: boolean,
    leftTick?: boolean,
}

const WithActiveItem = ({ activeTitle, leftTick = false }: WithActiveItemProps) => {
    const [selected, setSelected] = useState(undefined)
    const changeAction = action('onChange')

    const onChange = useCallback((value) => {
        changeAction(value)
        setSelected(value)
    }, [changeAction])

    return (
        <Popover
            title="Select"
            onChange={onChange}
            selectedItem={selected}
            activeTitle={activeTitle}
            leftTick={leftTick}
        >
            <Popover.Item value="1">Value 1</Popover.Item>
            <Popover.Item value="2">Value 2</Popover.Item>
        </Popover>
    )
}

stories.add('with value and active item', () => <WithActiveItem />)

stories.add('with value, active item & title', () => <WithActiveItem activeTitle />)

stories.add('active item, left tick position', () => <WithActiveItem activeTitle leftTick />)
