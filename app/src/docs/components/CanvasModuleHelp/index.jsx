/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import cx from 'classnames'
import { Module } from '$editor/canvas/components/ModuleRenderer/ModuleRenderer.stories'

import styles from './canvasModuleHelp.pcss'

type PortHelpProps = {
    help: string,
    port: any,
}

// Need to capitalize the first letter in JS because text-transform capitalize
// doesn't play well with inline elements.
const capitalizeText = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

function PortHelp({ help, port }: PortHelpProps) {
    return (
        <div className={styles.portHelp}>
            <span className={styles.portName} title={port.name}>{port.displayName || port.name}</span>
            {port.type.split(/\s+/).map((type) => (
                <span className={styles.portType} key={type}> {type}.</span>
            ))}
            {!help ? null : (<span className={styles.portText}> <ReactMarkdown source={capitalizeText(help) || ''} />.</span>)}
            {isEmpty(port.defaultValue) ? null : (
                <span className={styles.defaultValue}> Default Value ${port.defaultValue}</span>
            )}
        </div>
    )
}

type PortsHelpProps = {
    module: any,
    help: any,
    portsKey: string,
}

function PortsHelp({ module, help, portsKey }: PortsHelpProps) {
    const ports = module[portsKey] || []
    return (
        ports.length ? (
            <div className={styles.portsHelp}>
                <div className={styles.portsContent}>
                    {ports.map((port) => (
                        <PortHelp key={port.id} port={port} help={get(help, [portsKey, port.name], '')} />
                    ))}
                </div>
            </div>
        ) : null
    )
}

type Props = {
    module: any,
    help: any,
    minifiedContent?: boolean,
    className?: string,
}

export default function CanvasModuleHelp({ module: m, help, minifiedContent, className }: Props) {
    return (
        <section
            key={m.id}
            className={cx(
                styles.root,
                className, {
                    [styles.minifiedContent]: minifiedContent,
                },
            )}
        >
            <div className={styles.nameAndDescription}>
                {minifiedContent ? null : <h4>{m.name}</h4>}
                <ReactMarkdown source={help && help.helpText} />
            </div>
            {minifiedContent ? null : (
                <div className={styles.moduleContainer}>
                    <Module
                        src={Object.assign({
                            params: [],
                            inputs: [],
                            outputs: [],
                        }, m, {
                            name: m.name || '<Empty>',
                        })}
                    />
                </div>
            )}
            <div className={styles.ports}>
                <div>
                    {!minifiedContent || (!m.inputs.length && !m.params.length) ? null : (<h6>Inputs</h6>)}
                    <PortsHelp module={m} help={help} portsKey="inputs" />
                    <PortsHelp module={m} help={help} portsKey="params" />
                </div>
                <div>
                    {!minifiedContent || !m.outputs.length ? null : (<h6>Outputs</h6>)}
                    <PortsHelp module={m} help={help} portsKey="outputs" />
                </div>
            </div>
        </section>
    )
}
