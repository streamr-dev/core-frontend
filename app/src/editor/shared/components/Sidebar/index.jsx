// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import Header from './Header'
import Content from './Content'
import Section from './Section'
import Select from './Select'

import styles from './sidebar.pcss'

type Props = {
    isOpen: boolean,
    children?: Node,
}

const ModuleSidebar = ({ isOpen, children }: Props) => (
    <div className={cx(styles.sidebar)} hidden={!isOpen}>
        {children}
    </div>
)

export {
    Header,
    Content,
    Section,
    Select,
}

export default withErrorBoundary(ErrorComponentView)(ModuleSidebar)
