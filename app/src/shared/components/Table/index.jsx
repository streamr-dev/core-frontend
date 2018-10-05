// @flow

import React from 'react'

import PropTypes from 'prop-types'
import { Table as ReactstrapTable } from 'reactstrap'
import cx from 'classnames'
import styles from './table.pcss'

type Props = {
    children: PropTypes.element,
    className?: String,
}

const Table = ({ children, className, ...props }: Props) => (
    <ReactstrapTable responsive className={cx(className, styles.table)} {...props}>
        {children}
    </ReactstrapTable>
)

export default Table
