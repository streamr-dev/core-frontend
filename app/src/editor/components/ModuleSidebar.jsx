import React from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'
import { Collapse } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import * as CanvasState from '../state'
import styles from './ModuleSidebar.pcss'
import TextInput from './TextInput'
import ModuleHelp from './ModuleHelp'

export default withErrorBoundary(ErrorComponentView)(class ModuleSidebar extends React.PureComponent {
    onChange = (name) => (_value) => {
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
        const { canvas, selectedModuleHash, isOpen, open } = this.props
        const module = CanvasState.getModule(canvas, selectedModuleHash)
        if (!module) {
            return <div className={cx(styles.sidebar)} hidden={!isOpen} />
        }
        const optionsKeys = Object.keys(module.options || {})
        const isRunning = canvas.state === CanvasState.RunStates.Running
        return (
            <div className={cx(styles.sidebar)} hidden={!isOpen}>
                <div className={cx(styles.sidebarInner)}>
                    <div className={cx(styles.header)}>
                        <h3 className={cx(styles.name)}>{module.displayName || module.name}</h3>
                        <button type="button" onClick={() => open(false)}><CloseIcon /></button>
                    </div>
                    <div className={cx(styles.content)}>
                        {!optionsKeys.length ? null : (
                            <div className={cx(styles.options)}>
                                <Accordion label={I18n.t('editor.module.options')} initialIsOpen>
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
                                                            <TextInput value={option.value} onChange={this.onChange(name)} disabled={!!isRunning}>
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
                                </Accordion>
                            </div>
                        )}
                        <div className={cx(styles.help)}>
                            <Accordion label={I18n.t('editor.module.about')}>
                                <div className={cx(styles.helpContent)}>
                                    <ModuleHelp moduleId={module.id} />
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

class Accordion extends React.Component {
    state = {
        isOpen: !!this.props.initialIsOpen,
    }

    open = (isOpen = true) => {
        this.setState({
            isOpen,
        })
    }

    render() {
        const { isOpen } = this.state
        const { children, label } = this.props
        return (
            <React.Fragment>
                <button className={styles.accordionToggle} type="button" onClick={() => this.open(!isOpen)}>
                    <span className={styles.accordionLabel}>{label}</span>
                    {isOpen ? <CollapseIcon /> : <ExpandIcon />}
                </button>
                <Collapse isOpen={isOpen}>
                    {children}
                </Collapse>
            </React.Fragment>
        )
    }
}

function CloseIcon(props = {}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
            <g fill="none" fillRule="evenodd" stroke="#CDCDCD" strokeLinecap="round" strokeWidth="1.5">
                <path d="M11.757 11.757l8.486 8.486M20.243 11.757l-8.486 8.486" />
            </g>
        </svg>
    )
}

function ExpandIcon(props = {}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
            <g fill="none" fillRule="evenodd" stroke="#CDCDCD" strokeLinecap="round" strokeWidth="1.5">
                <path d="M10 16.5h12M16 10.5v12" />
            </g>
        </svg>
    )
}

function CollapseIcon(props = {}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
            <path fill="none" fillRule="evenodd" stroke="#CDCDCD" strokeLinecap="round" strokeWidth="1.5" d="M10 16.5h12" />
        </svg>
    )
}
