// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import Header from './Header'
import Content from './Content'
import Section from './Section'

import styles from './sidebar.pcss'

type Props = {
    isOpen: boolean,
    children?: Node,
}

class ModuleSidebar extends React.PureComponent<Props> {
    static Header = Header
    static Content = Content
    static Section = Section

    render() {
        const { isOpen, children } = this.props
        return (
            <div className={cx(styles.sidebar)} hidden={!isOpen}>
                {children}
            </div>
        )
    }
}

export default withErrorBoundary(ErrorComponentView)(ModuleSidebar)
