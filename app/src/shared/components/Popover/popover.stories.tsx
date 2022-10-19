import React, { useState, useCallback } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styles from '@sambego/storybook-styles'
import styled from 'styled-components'
import PopoverItem from './PopoverItem'
import Popover from '.'
const Container = styled.div`
    display: inline-block;
`
const stories = storiesOf('Shared/Popover', module)
    .addDecorator(
        styles({
            padding: '2rem 12rem',
            color: 'white',
        }),
    )
    .addDecorator((callback) => <Container>{callback()}</Container>)
stories.add('basic', () => (
    <Popover title="Select">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
))
stories.add('basic (right menu align)', () => (
    <Popover
        title="Select"
        menuProps={{
            right: true,
        }}
    >
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
))
stories.add('basic (svg caret)', () => (
    <Popover title="Select" caret="svg">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
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
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
))
stories.add('basic (no caret)', () => (
    <Popover title="Select" caret={false}>
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
))
stories.add('meatball', () => (
    <Popover title="Select" caret={false} type="meatball">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
))
stories.add('meatball (gray)', () => (
    <Popover title="Select" caret={false} type="grayMeatball">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
))
const BlackPaddedContainer = styled.div`
    background: gray;
    padding: 1rem;
`
stories.add('meatball (white)', () => (
    <BlackPaddedContainer>
        <Popover title="Select" caret={false} type="whiteMeatball">
            <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
            <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
        </Popover>
    </BlackPaddedContainer>
))
stories.add('with value', () => (
    <Popover title="Select" onChange={action('onChange')}>
        <PopoverItem value="1">Value 1</PopoverItem>
        <PopoverItem value="2">Value 2</PopoverItem>
    </Popover>
))
type WithActiveItemProps = {
    activeTitle?: boolean
    leftTick?: boolean
}

const WithActiveItem = ({ activeTitle, leftTick = false }: WithActiveItemProps) => {
    const [selected, setSelected] = useState(undefined)
    const changeAction = action('onChange')
    const onChange = useCallback(
        (value) => {
            changeAction(value)
            setSelected(value)
        },
        [changeAction],
    )
    return (
        <Popover
            title="Select"
            onChange={onChange}
            selectedItem={selected}
            activeTitle={activeTitle}
            leftTick={leftTick}
        >
            <PopoverItem value="1">Value 1</PopoverItem>
            <PopoverItem value="2">Value 2</PopoverItem>
        </Popover>
    )
}

stories.add('with value and active item', () => <WithActiveItem />)
stories.add('with value, active item & title', () => <WithActiveItem activeTitle />)
stories.add('active item, left tick position', () => <WithActiveItem activeTitle leftTick />)
