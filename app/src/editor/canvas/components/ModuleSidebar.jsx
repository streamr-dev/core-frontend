import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import Header from '$editor/shared/components/Sidebar/Header'
import Content from '$editor/shared/components/Sidebar/Content'
import Section from '$editor/shared/components/Sidebar/Section'

import TextControl from '$shared/components/TextControl'

import * as CanvasState from '../state'
import styles from './ModuleSidebar.pcss'
import ModuleHelp from './ModuleHelp'

export default class ModuleSidebar extends React.PureComponent {
    onChange = (name) => (_value) => {
        if (this.props.selectedModuleHash == null) { return }
        const module = CanvasState.getModule(this.props.canvas, this.props.selectedModuleHash)
        const option = module.options[name]

        // format value based on option.type
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
        const { canvas, selectedModuleHash, onClose } = this.props
        const module = CanvasState.getModuleIfExists(canvas, selectedModuleHash)
        if (!module) {
            return null
        }

        const optionsKeys = Object.keys(module.options || {})
        const isRunning = canvas.state === CanvasState.RunStates.Running
        return (
            <React.Fragment>
                <Header
                    title={module.displayName || module.name}
                    onClose={onClose}
                />
                <Content>
                    {!optionsKeys.length ? null : (
                        <Section label="Options" initialIsOpen>
                            <div className={cx(styles.optionsFields)}>
                                {optionsKeys.map((name) => {
                                    const option = module.options[name]
                                    const id = `${module.id}.options.${name}`
                                    return (
                                        <React.Fragment key={id}>
                                            <label htmlFor={id}>{startCase(name)}</label>
                                            {option.possibleValues ? (
                                                /* Select */
                                                <select
                                                    id={id}
                                                    value={option.value}
                                                    onChange={this.onChangeValue(name)}
                                                >
                                                    {option.possibleValues.map(({ text, value }) => (
                                                        <option
                                                            key={value}
                                                            value={value}
                                                            disabled={!!isRunning}
                                                        >
                                                            {text}
                                                        </option>
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
                                                        disabled={!!isRunning}
                                                    />
                                                )) || (
                                                    /* Text */
                                                    <TextControl
                                                        disabled={!!isRunning}
                                                        id={id}
                                                        onCommit={this.onChange(name)}
                                                        value={option.value}
                                                    />
                                                )
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </Section>
                    )}
                    <Section label="About">
                        <ModuleHelp moduleId={module.id} />
                    </Section>
                </Content>
            </React.Fragment>
        )
    }
}
