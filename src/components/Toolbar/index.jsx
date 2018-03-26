// @flow

import React from 'react'
import Panel from '../Panel'
import styles from './toolbar.pcss'
import type { Node } from 'react'

type Props = {
    leftContent?: Node,
    rightContent?: Node,
}

const Toolbar = (props: Props) => {
    return (
        <Panel>
            <div className={styles.left}>
                {props.leftContent}
            </div>
            <div className={styles.right}>
                {props.rightContent}
            </div>
        </Panel>
    )
}

export default Toolbar
