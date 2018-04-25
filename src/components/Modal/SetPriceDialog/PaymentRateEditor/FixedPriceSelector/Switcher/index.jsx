// @flow

import React from 'react'
import Switch from 'react-toggle-switch'
import classnames from 'classnames'

import styles from './switcher.pcss'

type Props = {
    className?: string,
    onChange: (boolean) => void,
    onClick?: (...any) => void,
    [string]: any,
}

type State = {
    toggled: boolean
}

class Switcher extends React.Component<Props, State> {
    state = {
        toggled: false,
    }

    onClick = (...args: Array<any>) => {
        const newValue = !this.state.toggled
        this.setState({
            toggled: newValue,
        })
        this.props.onChange(newValue)
        if (this.props.onClick) {
            this.props.onClick(...args)
        }
    }

    render() {
        return (
            <Switch
                {...this.props}
                className={classnames(styles.switcher, this.props.className)}
                onClick={this.onClick}
            />
        )
    }
}

export default Switcher
