// @flow

import React, { useContext } from 'react'
import cx from 'classnames'

import ResizerProbe from '$editor/canvas/components/Resizer/Probe'
import ResizerContext from '../Resizer/Context'
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
    const { refreshProbes } = useContext(ResizerContext)

    return !!(inputs.length || outputs.length) && (
        <div className={cx(styles.root, className)}>
            <div className={styles.ports}>
                <ResizerProbe id="inputs" width="auto" group="Ports" />
                {inputs.map((port) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        key={port.id}
                        onPort={onPort}
                        onValueChange={onValueChange}
                        onSizeChange={refreshProbes}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
            <div className={styles.gutter}>
                <ResizerProbe id="gutter" width="auto" group="Ports" />
            </div>
            <div className={styles.ports}>
                <ResizerProbe id="outputs" width="auto" group="Ports" />
                {outputs.map((port) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        key={port.id}
                        onPort={onPort}
                        onValueChange={onValueChange}
                        onSizeChange={refreshProbes}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
        </div>
    )
}

export default Ports
