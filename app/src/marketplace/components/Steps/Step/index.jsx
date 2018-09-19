// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './step.pcss'

type Props = {
    children: Node,
    active?: boolean,
    className?: string,
}

const Step = ({ children, active, className }: Props) => (
    <div className={classNames(className, styles.step, active && styles.active)}>
        {children}
    </div>
)

export default Step
