import React, { useState, useCallback } from 'react'
import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import styled from 'styled-components'
import PopoverItem from './PopoverItem'
import Popover from './index'
const Container = styled.div`
    display: inline-block;
    padding: 2rem 12rem;
    color: white;
`

export const Basic = () => (
    <Popover title="Select">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')} disabled={true}>
            Another option
        </PopoverItem>
    </Popover>
)

Basic.story = {
    name: 'basic',
}

const meta: Meta<typeof Basic> = {
    title: 'Shared/Popover',
    component: Basic,
    decorators: [
        (Story) => {
            return (
                <Container>
                    <Story />
                </Container>
            )
        },
    ],
}

export default meta

export const BasicRightMenuAlign = () => (
    <Popover
        title="Select"
        menuProps={{
            right: true,
        }}
    >
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
)

BasicRightMenuAlign.story = {
    name: 'basic (right menu align)',
}

export const BasicSvgCaret = () => (
    <Popover title="Select" caret="svg">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
)

BasicSvgCaret.story = {
    name: 'basic (svg caret)',
}

export const Uppercase = () => (
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
)

Uppercase.story = {
    name: 'uppercase',
}

export const BasicNoCaret = () => (
    <Popover title="Select" caret={false}>
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
)

BasicNoCaret.story = {
    name: 'basic (no caret)',
}

export const Meatball = () => (
    <Popover title="Select" caret={false} type="meatball">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
)

Meatball.story = {
    name: 'meatball',
}

export const MeatballGray = () => (
    <Popover title="Select" caret={false} type="grayMeatball">
        <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
        <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
    </Popover>
)

MeatballGray.story = {
    name: 'meatball (gray)',
}

const BlackPaddedContainer = styled.div`
    background: gray;
    padding: 1rem;
`

export const MeatballWhite = () => (
    <BlackPaddedContainer>
        <Popover title="Select" caret={false} type="whiteMeatball">
            <PopoverItem onClick={action('Click me')}>Click me</PopoverItem>
            <PopoverItem onClick={action('Another option')}>Another option</PopoverItem>
        </Popover>
    </BlackPaddedContainer>
)

MeatballWhite.story = {
    name: 'meatball (white)',
}

export const WithValue = () => (
    <Popover title="Select" onChange={action('onChange')}>
        <PopoverItem value="1">Value 1</PopoverItem>
        <PopoverItem value="2">Value 2</PopoverItem>
    </Popover>
)

WithValue.story = {
    name: 'with value',
}

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

export const WithValueAndActiveItem = () => <WithActiveItem />

WithValueAndActiveItem.story = {
    name: 'with value and active item',
}

export const WithValueActiveItemTitle = () => <WithActiveItem activeTitle />

WithValueActiveItemTitle.story = {
    name: 'with value, active item & title',
}

export const ActiveItemLeftTickPosition = () => <WithActiveItem activeTitle leftTick />

ActiveItemLeftTickPosition.story = {
    name: 'active item, left tick position',
}
