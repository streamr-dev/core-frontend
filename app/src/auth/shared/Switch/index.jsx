// @flow

import * as React from 'react'

import styles from './switch.pcss'

type Props = {
    children: React.Node,
    current: number,
}

type State = {
    height: number | string,
}

class Switch extends React.Component<Props, State> {
    static defaultProps = {
        current: 0,
    }

    render = () => {
        const { current, children } = this.props

        return (
            <div className={styles.switch}>
                {/* FIXME: Use react-transition-group. */}
                {React.Children.toArray(children)[current]}
            </div>
        )
    }
}

export default Switch
