// @flow

import React, { Component } from 'react'
import cx from 'classnames'
import uniqueId from 'lodash/uniqueId'

import styles from './toggle.pcss'

type Props = {
    className?: string,
    onChange?: (checked: boolean) => void,
    value?: boolean,
}

type State = {
    id: string,
    value: boolean,
}

class Toggle extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            id: '',
            value: !!props.value,
        }
    }

    componentWillMount() {
        const id = uniqueId('toggle-')
        this.setState({
            id,
        })
    }

    onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const value = e.target.checked

        this.setState({
            value,
        })

        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    render() {
        const { className } = this.props
        const { id, value } = this.state

        return (
            <div className={cx(className)}>
                <label htmlFor={id} className={cx(styles.switch, styles.label)}>
                    <input id={id} type="checkbox" onChange={this.onChange} checked={value} />
                    <span className={cx(styles.slider)} />
                </label>
            </div>
        )
    }
}

export default Toggle
