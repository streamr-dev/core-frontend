import React from 'react'
import { Col, Row } from 'reactstrap'
import { Meta } from '@storybook/react'
import SvgIcon, { SvgIconNames } from '~/shared/components/SvgIcon'
import styled from 'styled-components'

export const All = () => (
    <Row>
        {SvgIconNames.map((name) => (
            <Col xs="4" key={name}>
                <IconWrapper>
                    <IconInner>
                        <SvgIcon name={name} />
                    </IconInner>
                    <span>{name}</span>
                </IconWrapper>
            </Col>
        ))}
        <Col xs="4">
            <IconWrapper>
                <IconInner>
                    <SvgIcon name="checkmark" size="large" />
                </IconInner>
                <span>checkmark size=large</span>
            </IconWrapper>
        </Col>
    </Row>
)

All.story = {
    name: 'all',
}

const meta: Meta<typeof All> = {
    title: 'Shared/SvgIcon',
    component: All,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '15px',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}
export default meta

export const IconWrapper = styled.div`
    align-items: center;
    color: #323232;
    display: flex;
    font-family: 'IBM Plex Mono', sans-serif;
    font-size: 16px;
    line-height: 1em;
`

export const IconInner = styled.div`
    border-radius: 2px;
    box-sizing: content-box;
    border: 1px solid #aaaaaa;
    margin-right: 1em;
    padding: 0.5em;
    min-height: 1em;
    min-width: 1em;
`
