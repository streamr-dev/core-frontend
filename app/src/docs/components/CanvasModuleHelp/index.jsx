/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import cx from 'classnames'

import styles from './canvasModuleHelp.pcss'

type PortHelpProps = {
    help: string,
    port: any,
}

function PortHelp({ help, port }: PortHelpProps) {
    return (
        <div className={styles.portHelp}>
            <div className={styles.portHelpHeader}>
                <h5 className={styles.portName} title={port.name}>{port.displayName || port.name}</h5>
            </div>
            <div className={styles.portTypes}>
                {port.type.split(/\s+/).map((type) => (
                    <span key={type}>{type}</span>
                ))}
            </div>
            {isEmpty(port.defaultValue) ? null : (
                <div className={styles.defaultValue}>
                    Default Value: <span>${port.defaultValue}</span>
                </div>
            )}
            <div className={styles.portHelpContent}>
                <ReactMarkdown source={help || ''} />
            </div>
        </div>
    )
}

type PortsHelpProps = {
    module: any,
    help: any,
    heading: string,
    portsKey: string,
}

function PortsHelp({ module, help, heading, portsKey }: PortsHelpProps) {
    const ports = module[portsKey] || []
    return (
        <div className={styles.portsHelp}>
            <h4 className={styles.portTypesHeading}>{heading}</h4>
            <div className={styles.portsContent}>
                {ports.length ? (
                    ports.map((port) => (
                        <PortHelp key={port.id} port={port} help={get(help, [portsKey, port.name], '')} />
                    ))
                ) : (
                    <div className={styles.portHelp}>
                        <em>None</em>
                    </div>
                )}
            </div>
        </div>
    )
}

type Props = {
    module: any,
    help: any,
    hideName?: boolean,
    className?: string,
}

export default function CanvasModuleHelp({ module: m, help, hideName, className }: Props) {
    return (
        <section key={m.id} className={cx(styles.root, className)}>
            {hideName ? null : <h3>{m.name}</h3>}
            <ReactMarkdown source={help && help.helpText} />
            <div className={styles.ports}>
                <PortsHelp module={m} help={help} heading="Inputs" portsKey="inputs" />
                <PortsHelp module={m} help={help} heading="Parameters" portsKey="params" />
                <PortsHelp module={m} help={help} heading="Outputs" portsKey="outputs" />
            </div>
        </section>
    )
}
