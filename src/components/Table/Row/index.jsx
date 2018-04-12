// @flow

import React from 'react'
import type { Node } from 'react'
import classNames from 'classnames'
import { Row as LayoutRow, Col } from '@streamr/streamr-layout'
import { withHover } from '../../WithHover'

import pageStyles from '../table.pcss'

export type Props = {
    title: string,
    className: string,
    children?: Node,
    isHovered: boolean,
    hoverComponent?: Node,
}

export const Row = ({
    title,
    className,
    children,
    isHovered,
    hoverComponent,
}: Props) => (
    <LayoutRow className={pageStyles.row}>
        {title && (
            <Col xs={4}>
                <div className={classNames(pageStyles.cell, className)}>
                    {(isHovered && hoverComponent) || title}
                </div>
            </Col>
        )}
        <Col xs={title ? 8 : 12}>
            <div className={classNames(pageStyles.cell, className)}>
                {children}
            </div>
        </Col>
    </LayoutRow>
)

export default withHover(Row)
