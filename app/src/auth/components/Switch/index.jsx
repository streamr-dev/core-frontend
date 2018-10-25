// @flow

import * as React from 'react'

import styles from './switch.pcss'

type Props = {
    children: React.Node,
    current: number,
}

const Switch = ({ children, current }: Props) => (
    <div className={styles.switch}>
        {/* FIXME: Use react-transition-group. */}
        {React.Children.toArray(children)[current]}
    </div>
)

Switch.defaultProps = {
    current: 0,
}

export default Switch
