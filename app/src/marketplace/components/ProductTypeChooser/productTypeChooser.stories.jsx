// @flow

import React from 'react'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import ProductTypeChooser from '.'

const Container = styled.div`
    background: #F8F8F8;
    color: #323232;
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

storiesOf('Marketplace/ProductTypeChooser', module)
    .addDecorator(StoryRouter())
    .addWithJSX('basic', () => (
        <Container>
            <ProductTypeChooser />
        </Container>
    ))

