// @flow

import React from 'react'

import classNames from 'classnames'
import pageStyles from '../table.pcss'

import TableRow from '../Row/index'
import type { Props } from '../Row/index'

export const HeaderRow = (props: Props) => {
    const { className, ...rest } = props
    return <TableRow className={classNames(pageStyles.headerCell, className)} {...rest} />
}

export default HeaderRow
