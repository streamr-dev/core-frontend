// @flow

import React, { type Node } from 'react'
import { titleCase } from 'change-case'

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

    const Component = ({ children, className, ...props }: ComponentProps) => {
        const propsWithoutFlags = {
            ...props,
        }
        const styleFlags = (styleOverrides || []).reduce((result, flag) => {
            if (props[flag]) {
                delete propsWithoutFlags[flag]
            }

            return styles[flag] ? {
                ...result,
                [styles[flag]]: !!props[flag],
            } : result
        }, {})

        return (
            <Element {...propsWithoutFlags} className={cx(className, styleFlags)}>{children}</Element>
        )
    }

    Component.displayName = titleCase(Element)

    return Component
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
            <ReactstrapTable {...props} className={cx(className, styles.table)}>
                {children}
            </ReactstrapTable>
        )
    }
}
