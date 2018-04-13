// @flow

import React, { type Node } from 'react'

import Panel from '../Panel'
import Buttons, { type ButtonActions } from '../Buttons'

import styles from './toolbar.pcss'

type Props = {
    status?: Node,
    actions?: ButtonActions,
}

const Toolbar = ({ status, actions }: Props) => (
    <Panel>
        <div className={styles.left}>
            {status}
        </div>
        <div className={styles.right}>
            {actions && (
                <Buttons actions={actions} />
            )}
        </div>
    </Panel>
)

export default Toolbar
