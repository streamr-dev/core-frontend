import React from 'react'
import { Col, Row } from 'reactstrap'
import { Meta } from '@storybook/react'
import PngIcon from '~/shared/components/PngIcon'
import sharedStyles from './shared.pcss'

export const All = () => (
    <Row>
        {PngIcon.names.map((name) => (
            <Col xs="4" key={name}>
                <div key={name} className={sharedStyles.iconWrapper}>
                    <div className={sharedStyles.iconInner}>
                        <PngIcon name={name} className={sharedStyles.pngIcon} />
                    </div>
                    <span>{name}</span>
                </div>
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
