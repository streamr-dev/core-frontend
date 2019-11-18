// @flow

import React, { useContext, useEffect } from 'react'
import cx from 'classnames'
import useModule from '../ModuleRenderer/useModule'
import useModuleApi from '../ModuleRenderer/useModuleApi'

import Probe from '$editor/canvas/components/Resizable/SizeConstraintProvider/Probe'
import { Context as SizeConstraintContext } from '../Resizable/SizeConstraintProvider'
import Port from './Port'
import styles from './ports.pcss'

type Props = {
    className?: ?string,
    onPort: any,
    onValueChange: any,
}

const Ports = ({ className, onPort, onValueChange }: Props) => {
    const { module: { outputs, params, ...module } } = useModule()
    const inputs = params.concat(module.inputs)
    const { port: { setPortOptions } } = useModuleApi()
    const { refreshProbes } = useContext(SizeConstraintContext)
    const maxPorts = Math.max(inputs.length, outputs.length)

    useEffect(() => {
        // Adding/removing variadic ports should trigger Probes
        // to reestimate space they occupy.
        refreshProbes()
    }, [maxPorts, refreshProbes])

    return !!(inputs.length || outputs.length) && (
        <div className={cx(styles.root, className)}>
            <div className={styles.ports}>
                <Probe uid="inputs" width="auto" group="Ports" />
                {inputs.map((port) => (
                    <Port
                        key={port.id}
                        onPort={onPort}
                        onValueChange={onValueChange}
                        onSizeChange={refreshProbes}
                        port={port}
                        setOptions={setPortOptions}
                    />
                ))}
            </div>
            <div className={styles.gutter}>
                <Probe uid="gutter" width="auto" group="Ports" />
            </div>
            <div className={styles.ports}>
                <Probe uid="outputs" width="auto" group="Ports" />
                {outputs.map((port) => (
                    <Port
                        key={port.id}
                        onPort={onPort}
                        onValueChange={onValueChange}
                        onSizeChange={refreshProbes}
                        port={port}
                        setOptions={setPortOptions}
                    />
                ))}
            </div>
        </div>
    )
}

// $FlowFixMe
export default React.memo(Ports)
