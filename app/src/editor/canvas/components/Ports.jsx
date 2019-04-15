/* eslint-disable react/no-unused-state */
import React from 'react'
import cx from 'classnames'

import Port from './Ports/Port'
import styles from './Ports.pcss'

const Ports = ({
    api,
    module,
    canvas,
    onPort,
    onValueChange,
    className,
}) => {
    const { outputs } = module
    const inputs = module.params.concat(module.inputs)

    return !!(inputs.length || outputs.length) && (
        <div className={cx(className, styles.ports)}>
            <div className={styles.inputs}>
                {inputs.map((port, index) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        /* eslint-disable react/no-array-index-key */
                        key={port.id + index}
                        onValueChange={onValueChange}
                        onPort={onPort}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
            <div className={styles.outputs}>
                {outputs.map((port, index) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        /* eslint-disable react/no-array-index-key */
                        key={port.id + index}
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
