import React from 'react'
import styled from 'styled-components'
import {Meta} from "@storybook/react"
import AvatarImage from '.'
const Container = styled.div`
    width: 200px;
    height: 200px;
    border: 1px solid #efefef;
`

export const Default = () => (
    <Container>
        <AvatarImage
            src="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
            name="Matt Innes"
        />
    </Container>
)

const meta: Meta<typeof Default> = {
    title: 'Shared/AvatarImage',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '3rem',
        }}>
            <Story/>
        </div>
    }]
}

export default meta

Default.story = {
    name: 'default',
}

export const PlaceholderInitials = () => (
    <Container>
        <AvatarImage name="Matt Innes" />
    </Container>
)

PlaceholderInitials.story = {
    name: 'placeholder initials',
}

export const PlaceholderAddress = () => (
    <Container>
        <AvatarImage username="0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1" />
    </Container>
)

PlaceholderAddress.story = {
    name: 'placeholder address',
}

export const PlaceholderImage = () => (
    <Container>
        <AvatarImage />
    </Container>
)

PlaceholderImage.story = {
    name: 'placeholder image',
}

export const PlaceholderImageUpload = () => (
    <Container>
        <AvatarImage upload />
    </Container>
)

PlaceholderImageUpload.story = {
    name: 'placeholder image upload',
}
