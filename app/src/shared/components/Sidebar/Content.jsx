// @flow

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import React, { type Node } from 'react'
import cx from 'classnames'

import styles from './Sidebar.pcss'

type Props = {
    children?: Node,
    className?: string,
}

const Content = ({ children, className }: Props) => (
    <div className={cx(styles.content, className)}>
        {children}
    </div>
)

export default withErrorBoundary((props) => (
    <Content {...props}>
        <ErrorComponentView {...props} />
    </Content>
))(Content)
