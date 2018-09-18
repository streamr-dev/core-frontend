// @flow

import React from 'react'

import classNames from 'classnames'
import pageStyles from '../table.pcss'

import TableRow from '../Row'
import type { Props } from '../Row'

export const HeaderRow = (props: Props) => {
    const { className, ...rest } = props
    return <TableRow className={classNames(pageStyles.headerCell, className)} {...rest} />
}

export default HeaderRow
