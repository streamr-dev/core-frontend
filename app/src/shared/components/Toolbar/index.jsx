// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import Buttons, { type ButtonActions } from '$shared/components/Buttons'

import styles from './toolbar.pcss'

type Props = {
    left?: Node,
    middle?: Node,
    actions?: ButtonActions,
    altMobileLayout?: boolean,
    className?: string,
}

const Toolbar = ({
    className,
    left,
    middle,
    actions,
    altMobileLayout,
}: Props) => (
    <div
        className={cx(styles.toolbar, className, {
            [styles.altMobileLayout]: altMobileLayout,
        })}
    >
        <div className={cx(styles.left, {
            [styles.noMiddle]: !middle,
        })}
        >
            {left}
        </div>
        <div className={styles.middle}>
            {middle}
        </div>
        <div className={styles.right}>
            {actions && (
                <Buttons actions={actions} className={styles.buttons} />
            )}
        </div>
    </div>
)

Toolbar.styles = styles

export default Toolbar
