import React, { useEffect, useContext, useRef } from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import { Header, Content, Section } from '$editor/shared/components/Sidebar'

import TextControl from '$shared/components/TextControl'

import * as CanvasState from '../state'
import * as RunController from './CanvasController/Run'
import styles from './ModuleSidebar.pcss'
import ModuleHelp from './ModuleHelp'

export default function ModuleSidebar({ canvas, selectedModuleHash, setModuleOptions, onClose }) {
    const { isEditable } = useContext(RunController.Context)
    const onChange = (name) => (_value) => {
        if (selectedModuleHash == null) { return }
        const module = CanvasState.getModule(canvas, selectedModuleHash)
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

        setModuleOptions(selectedModuleHash, {
            [name]: value,
        })
    }

    const onChangeValue = (name) => (event) => {
        onChange(name)(event.target.value)
    }

    const onChangeChecked = (name) => (event) => {
        onChange(name)(event.target.checked)
    }

    const module = CanvasState.getModuleIfExists(canvas, selectedModuleHash)
    const hasModule = !!module

    const hadModule = useRef(hasModule)

    useEffect(() => {
        // close sidebar if had module but have module no more
        if (!hasModule && hadModule.current) {
            onClose()
        }
        hadModule.current = hasModule
    }, [hasModule, onClose, hadModule])

    if (!hasModule) {
        return null
    }

    const optionsKeys = Object.keys(module.options || {})
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
                                                onChange={onChangeValue(name)}
                                            >
                                                {option.possibleValues.map(({ text, value }) => (
                                                    <option
                                                        key={value}
                                                        value={value}
                                                        disabled={!isEditable}
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
                                                    onChange={onChangeChecked(name)}
                                                    disabled={!isEditable}
                                                />
                                            )) || (
                                                /* Text */
                                                <TextControl
                                                    disabled={!isEditable}
                                                    id={id}
                                                    onCommit={onChange(name)}
                                                    value={option.value}
                                                    immediateCommit={false}
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
