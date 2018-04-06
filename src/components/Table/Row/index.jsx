// @flow

import React from 'react'
import type { Node } from 'react'
import classNames from 'classnames'
import { Row as LayoutRow, Col } from '@streamr/streamr-layout'

import pageStyles from '../table.pcss'

export type Props = {
    title: string,
    className: string,
    children?: Node,
}

export const Row = ({ title, className, children }: Props) => (
    <LayoutRow>
        {title && (
            <Col xs={4}>
                <div className={classNames(pageStyles.cell, className)}>{title}</div>
            </Col>
        )}
        <Col xs={title ? 8 : 12}>
            <div className={classNames(pageStyles.cell, className)}>
                {children}
            </div>
        </Col>
    </LayoutRow>
)

export default Row
