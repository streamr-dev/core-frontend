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
    <LayoutRow className={
        classNames({
            [className]: true,
            [pageStyles.row]: true,
            [pageStyles.rowHover]: hoverComponent,
        })}
    >
        {title && (
            <Col xs={4} className={classNames(pageStyles.cell)}>
                {(isHovered && hoverComponent) || title}
            </Col>
        )}
        <Col xs={title ? 8 : 12} className={classNames(pageStyles.cell)}>
            {children}
        </Col>
    </LayoutRow>
)

export default withHover(Row)
