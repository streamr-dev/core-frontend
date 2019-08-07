/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import styles from './canvasModuleHelp.pcss'

type PortHelpProps = {
    module: any,
    port: any,
    portsKey: string,
}

function PortHelp({ module, port, portsKey }: PortHelpProps) {
    return (
        <div className={styles.portHelp}>
            <div className={styles.portHelpHeader}>
                <h5 className={styles.portName} title={port.name}>{port.displayName || port.name}</h5>
                <div className={styles.portTypes}>
                    {port.type.split(/\s+/).map((type) => (
                        <span key={type}>{type}</span>
                    ))}
                </div>
            </div>
            {isEmpty(port.defaultValue) ? null : (
                <div className={styles.defaultValue}>
                    Default Value: <span>${port.defaultValue}</span>
                </div>
            )}
            <div className={styles.portHelpContent}>
                <ReactMarkdown source={get(module, ['help', portsKey, port.name], '')} />
            </div>
        </div>
    )
}

type PortsHelpProps = {
    module: any,
    heading: string,
    portsKey: string,
}

function PortsHelp({ module, heading, portsKey }: PortsHelpProps) {
    const ports = module[portsKey] || []
    return (
        <div className={styles.portsHelp}>
            <h4 className={styles.portTypesHeading}>{heading}</h4>
            <div className={styles.portsContent}>
                {ports.length ? (
                    ports.map((port) => (
                        <PortHelp key={port.id} module={module} portsKey={portsKey} port={port} />
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
    hideName?: boolean,
}

export default function CanvasModuleHelp({ module: m, hideName }: Props) {
    return (
        <section key={m.id} className={styles.root}>
            {hideName ? null : <h3>{m.name}</h3>}
            <ReactMarkdown source={m.help && m.help.helpText} />
            <div className={styles.ports}>
                <PortsHelp module={m} heading="Inputs" portsKey="inputs" />
                <PortsHelp module={m} heading="Parameters" portsKey="params" />
                <PortsHelp module={m} heading="Outputs" portsKey="outputs" />
            </div>
        </section>
    )
}
