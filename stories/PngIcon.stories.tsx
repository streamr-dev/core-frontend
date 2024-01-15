import React from 'react'
import { Col, Row } from 'reactstrap'
import { Meta } from '@storybook/react'
import PrestyledPngIcon from '~/shared/components/PngIcon'
import styled from 'styled-components'
import { IconInner, IconWrapper } from './SvgIcon.stories'

export const All = () => (
    <Row>
        {PngIcon.names.map((name) => (
            <Col xs="4" key={name}>
                <IconWrapper>
                    <IconInner>
                        <PngIcon name={name} />
                    </IconInner>
                    <span>{name}</span>
                </IconWrapper>
            </Col>
        ))}
    </Row>
)

All.story = {
    name: 'all',
}

const meta: Meta<typeof All> = {
    title: 'Shared/PngIcon',
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

const PngIcon = styled(PrestyledPngIcon)`
    display: block;
    max-height: 3em;
    max-width: 3em;
`
