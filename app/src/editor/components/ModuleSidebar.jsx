import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import * as CanvasState from '../state'
import styles from './ModuleSidebar.pcss'

export default class ModuleSidebar extends React.Component {
    onChange = (name, isCheckbox = false) => (event) => {
        const { target } = event
        this.setState({
            [name]: isCheckbox ? target.checked : target.value,
        })
    }

    render() {
        const module = CanvasState.getModule(this.props.canvas, this.props.selectedModuleHash)
        if (!module) {
            return <div className={cx(styles.sidebar)} hidden={!this.props.isOpen} />
        }
        const optionsKeys = Object.keys(module.options || {})
        return (
            <div className={cx(styles.sidebar)} hidden={!this.props.isOpen}>
                <div className={cx(styles.header)}>
                    <h3 className={cx(styles.name)}>{module.displayName || module.name}</h3>
                    <button type="button" onClick={() => this.props.open(false)}>X</button>
                </div>
                <div className={cx(styles.content)}>
                    {!optionsKeys.length ? null : (
                        <div className={cx(styles.options)}>
                            <h4>Options</h4>
                            {optionsKeys.map((name) => {
                                const option = module.options[name]
                                const id = `${module.id}.options.${name}`
                                return (
                                    <React.Fragment key={id}>
                                        <label htmlFor={id}>{startCase(name)}</label>
                                        {option.type === 'boolean' ? (
                                            <input id={id} checked={option.value} type="checkbox" onChange={this.onChange(name, true)} />
                                        ) : (
                                            <input id={id} value={option.value} onChange={this.onChange(name)} />
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
