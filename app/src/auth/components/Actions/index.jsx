// @flow

import * as React from 'react'
import styles from './actions.pcss'

type Props = {
    children: React.Node,
}

const Actions = ({ children }: Props) => (
    <div className={styles.root}>
        {React.Children.count(children) === 1 && <span />}
        {children}
    </div>
)

Actions.styles = styles

export default Actions
