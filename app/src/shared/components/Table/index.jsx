// @flow

import React, { type Node } from 'react'

import PropTypes from 'prop-types'
import { Table as ReactstrapTable } from 'reactstrap'
import cx from 'classnames'
import styles from './table.pcss'

type Props = {
    children: PropTypes.element,
    className?: String,
}

const makeComponent = (Element: string, styleOverrides?: Array<string> = []) => {
    type ComponentProps = {
        className?: string,
        children?: Node,
    }

    return ({ children, className, ...props }: ComponentProps) => {
        const styleFlags = (styleOverrides || []).reduce((result, flag) => (
            styles[flag] ? {
                ...result,
                [styles[flag]]: !!props[flag],
            } : result
        ), {})

        return (
            <Element className={cx(className, styleFlags)} {...props}>{children}</Element>
        )
    }
}

export const Head = makeComponent('thead')
export const Body = makeComponent('tbody')
export const Tr = makeComponent('tr')
export const Td = makeComponent('td', ['noWrap'])
export const Th = makeComponent('th', ['noWrap'])

export default class Table extends React.Component<Props> {
    static Head = Head
    static Body = Body
    static Tr = Tr
    static Th = Th
    static Td = Td

    render() {
        const { children, className, ...props } = this.props

        return (
            <ReactstrapTable responsive className={cx(className, styles.table)} {...props}>
                {children}
            </ReactstrapTable>
        )
    }
}
