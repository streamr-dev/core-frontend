// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './step.pcss'

type Props = {
    children: Node,
    active?: boolean,
}

const Step = ({ children, active }: Props) => (
    <div className={classNames(styles.step, active && styles.active)}>
        {children}
    </div>
)

export default Step
