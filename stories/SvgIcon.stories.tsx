import React from 'react'
import { Col, Row } from 'reactstrap'
import { Meta } from '@storybook/react'
import SvgIcon from '~/shared/components/SvgIcon'
import sharedStyles from './shared.pcss'

export const All = () => (
    <Row>
        {SvgIcon.names.map((name) => (
            <Col xs="4" key={name}>
                <div key={name} className={sharedStyles.iconWrapper}>
                    <div className={sharedStyles.iconInner}>
                        <SvgIcon name={name} className={sharedStyles.svgIcon} />
                    </div>
                    <span>{name}</span>
                </div>
            </Col>
        ))}
        <Col xs="4">
            <div className={sharedStyles.iconWrapper}>
                <div className={sharedStyles.iconInner}>
                    <SvgIcon
                        name="checkmark"
                        size="large"
                        className={sharedStyles.svgIcon}
                    />
                </div>
                <span>checkmark size=large</span>
            </div>
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
