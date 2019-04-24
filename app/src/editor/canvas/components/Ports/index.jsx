// @flow

import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import ResizerProbe from '$editor/canvas/components/Resizer/Probe'
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
    const [probeCounter, setProbeCounter] = useState(0)
    const onPortSizeChange = useCallback(() => {
        setProbeCounter((probeCounter) => probeCounter + 1)
    }, [])

    return !!(inputs.length || outputs.length) && (
        <div className={cx(styles.root, className)}>
            <ResizerProbe key={probeCounter} id="Ports" height="auto" group="ModuleHeight" />
            <div className={styles.inner}>
                <div className={styles.ports}>
                    <ResizerProbe key={probeCounter} id="inputs" width="auto" group="Ports" />
                    {inputs.map((port) => (
                        <Port
                            api={api}
                            canvas={canvas}
                            key={port.id}
                            onPort={onPort}
                            onValueChange={onValueChange}
                            onSizeChange={onPortSizeChange}
                            port={port}
                            setOptions={api.port.setPortOptions}
                        />
                    ))}
                </div>
                <div className={styles.gutter}>
                    <ResizerProbe key={probeCounter} id="gutter" width="auto" group="Ports" />
                </div>
                <div className={styles.ports}>
                    <ResizerProbe key={probeCounter} id="outputs" width="auto" group="Ports" />
                    {outputs.map((port) => (
                        <Port
                            api={api}
                            canvas={canvas}
                            key={port.id}
                            onPort={onPort}
                            onValueChange={onValueChange}
                            onSizeChange={onPortSizeChange}
                            port={port}
                            setOptions={api.port.setPortOptions}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Ports
