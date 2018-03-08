// @flow

import React from 'react'
import classNames from 'classnames'
import { Row as LayoutRow, Col } from '@streamr/streamr-layout'

import pageStyles from '../../productPage.pcss'

export type Props = {
    name: string,
    description?: ?string,
    className?: string,
}

export const Row = ({ name, description, className }: Props) => (
    <LayoutRow>
        <Col xs={description ? 4 : 12}>
            <div className={classNames(pageStyles.cell, className)}>{name}</div>
        </Col>
        {description && (
            <Col xs={8}>
                <div className={classNames(pageStyles.cell, pageStyles.headerCell)}>Description</div>
            </Col>
        )}
    </LayoutRow>
)

export default Row
