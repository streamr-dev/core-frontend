import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import * as CanvasState from '../state'
import styles from './ModuleSidebar.pcss'
import TextInput from './TextInput'

export default class ModuleSidebar extends React.Component {
    onChange = (name) => (_value) => {
        const module = CanvasState.getModule(this.props.canvas, this.props.selectedModuleHash)
        const option = module.options[name]
        let value = _value
        if (option.type === 'int') {
            value = parseInt(value, 10)
        }

        if (option.type === 'double') {
            value = Number(value)
        }

        if (option.type === 'string' || option.type === 'color') {
            value = value.trim()
        }

        this.props.setModuleOptions(this.props.selectedModuleHash, {
            [name]: value,
        })
    }

    onChangeValue = (name) => (event) => {
        this.onChange(name)(event.target.value)
    }

    onChangeChecked = (name) => (event) => {
        this.onChange(name)(event.target.checked)
    }

    render() {
        const module = CanvasState.getModule(this.props.canvas, this.props.selectedModuleHash)
        if (!module) {
            return <div className={cx(styles.sidebar)} hidden={!this.props.isOpen} />
        }
        const optionsKeys = Object.keys(module.options || {})
        return (
            <div className={cx(styles.sidebar)} hidden={!this.props.isOpen}>
                <div className={cx(styles.sidebarInner)}>
                    <div className={cx(styles.header)}>
                        <h3 className={cx(styles.name)}>{module.displayName || module.name}</h3>
                        <button type="button" onClick={() => this.props.open(false)}>X</button>
                    </div>
                    <div className={cx(styles.content)}>
                        {!optionsKeys.length ? null : (
                            <div className={cx(styles.options)}>
                                <h4>Options</h4>
                                <div className={cx(styles.optionsFields)}>
                                    {optionsKeys.map((name) => {
                                        const option = module.options[name]
                                        const id = `${module.id}.options.${name}`
                                        return (
                                            <React.Fragment key={id}>
                                                <label htmlFor={id}>{startCase(name)}</label>
                                                {option.possibleValues ? (
                                                    /* Select */
                                                    <select id={id} value={option.value} onChange={this.onChangeValue(name)}>
                                                        {option.possibleValues.map(({ text, value }) => (
                                                            <option key={value} value={value}>{text}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    /* Toggle */
                                                    (option.type === 'boolean' && (
                                                        <input
                                                            id={id}
                                                            checked={option.value}
                                                            type="checkbox"
                                                            onChange={this.onChangeChecked(name)}
                                                        />
                                                    )) || (
                                                        /* Text */
                                                        <TextInput value={option.value} onChange={this.onChange(name)}>
                                                            {({ innerRef, ...props }) => (
                                                                <input id={id} type="text" {...props} ref={innerRef} />
                                                            )}
                                                        </TextInput>
                                                    )
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
