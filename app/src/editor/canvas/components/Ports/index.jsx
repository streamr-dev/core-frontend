// @flow

import React from 'react'
import cx from 'classnames'

import Port from './Port'
import styles from './ports.pcss'

type Props = {
    api: any,
    canvas: any,
    className?: ?string,
    module: any,
    onPort: any,
    onValueChange: any,
}

const Ports = ({
    api,
    canvas,
    className,
    module,
    onPort,
    onValueChange,
}: Props) => {
    const { outputs } = module
    const inputs = module.params.concat(module.inputs)

    return !!(inputs.length || outputs.length) && (
        <div className={cx(className, styles.ports)}>
            <div className={styles.inputs}>
                {inputs.map((port) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        key={port.id}
                        onValueChange={onValueChange}
                        onPort={onPort}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
            <div className={styles.outputs}>
                {outputs.map((port) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        key={port.id}
                        onValueChange={onValueChange}
                        onPort={onPort}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
        </div>
    )
}

export default Ports
