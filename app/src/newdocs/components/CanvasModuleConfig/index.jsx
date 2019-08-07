/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ReactMarkdown from 'react-markdown'
import get from 'lodash/get'

import styles from './canvasModuleConfig.pcss'

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
                        <span>{type}</span>
                    ))}
                </div>
            </div>
            {isEmpty(port.defaultValue) ? null : (
                <p>Default value: ${port.defaultValue}</p>
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
}

function CanvasModuleConfig({ module }: Props) {
    return (
        <div className={styles.root}>
            <PortsHelp module={module} heading="Inputs" portsKey="inputs" />
            <PortsHelp module={module} heading="Parameters" portsKey="params" />
            <PortsHelp module={module} heading="Outputs" portsKey="outputs" />
        </div>
    )
}

export default CanvasModuleConfig
