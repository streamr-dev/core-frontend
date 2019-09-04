import React, { useEffect, useContext, useRef } from 'react'
import cx from 'classnames'
import startCase from 'lodash/startCase'

import { Header, Content, Section, Select } from '$editor/shared/components/Sidebar'
import Toggle from '$shared/components/Toggle'
import Text from '$editor/canvas/components/Ports/Value/Text'

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

    const onSelectChange = (name) => ({ value }) => {
        onChange(name)(value)
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
                                const opts = option.possibleValues ? option.possibleValues.map(({ text, value }) => ({
                                    label: text,
                                    value,
                                })) : []
                                return (
                                    <React.Fragment key={id}>
                                        <label htmlFor={id}>{startCase(name)}</label>
                                        {option.possibleValues ? (
                                            /* Select */
                                            <Select
                                                id={id}
                                                className={styles.select}
                                                value={opts.filter((opt) => opt.value === option.value)}
                                                onChange={onSelectChange(name)}
                                                options={opts}
                                                disabled={!isEditable}
                                            />
                                        ) : (
                                            /* Toggle */
                                            (option.type === 'boolean' && (
                                                <Toggle
                                                    id={id}
                                                    className={styles.toggle}
                                                    value={option.value}
                                                    onChange={onChange(name)}
                                                    disabled={!isEditable}
                                                />
                                            )) || (
                                                /* Text */
                                                <Text
                                                    id={id}
                                                    className={styles.input}
                                                    value={option.value}
                                                    onChange={onChange(name)}
                                                    disabled={!isEditable}
                                                />
                                            )
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </Section>
                )}
                <Section label="About" initialIsOpen>
                    <ModuleHelp module={module} />
                </Section>
            </Content>
        </React.Fragment>
    )
}
