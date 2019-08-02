/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ReactMarkdown from 'react-markdown'

import createMdSnippet from '$newdocs/utils/createMdSnippet'
import styles from './canvasModuleConfig.pcss'

const inputs = (moduleInputs, moduleInputsRaw) => {
    const types = []
    const defaultValues = []

    if (moduleInputs && moduleInputsRaw) {
        Object.entries(moduleInputs).map(([key]) =>
            moduleInputsRaw.map((ins) => {
                if (ins.name === key) {
                    types.push(ins.type)
                    defaultValues.push(ins.defaultValue)
                }
                return false
            }))
    }

    return !isEmpty(moduleInputs)
        ? createMdSnippet(moduleInputs, types, defaultValues)
        : false
}

const outputs = (moduleOutputs, moduleOutputsRaw) => {
    const types = []
    const defaultValues = []

    if (moduleOutputs && moduleOutputsRaw) {
        Object.entries(moduleOutputs).map(([key]) =>
            moduleOutputsRaw.map((outs) => {
                if (outs.name === key) {
                    types.push(outs.type)
                    defaultValues.push(outs.defaultValue)
                }
                return false
            }))
    }

    return !isEmpty(moduleOutputs)
        ? createMdSnippet(moduleOutputs, types, defaultValues)
        : false
}

const params = (moduleParams, moduleParamsRaw) => {
    const types = []
    const defaultValues = []

    if (moduleParams && moduleParamsRaw) {
        Object.entries(moduleParams).map(([key]) =>
            moduleParamsRaw.map((pms) => {
                if (pms.name === key) {
                    types.push(pms.type)
                    defaultValues.push(pms.defaultValue)
                }
                return false
            }))
    }

    return !isEmpty(moduleParams)
        ? createMdSnippet(moduleParams, types, defaultValues)
        : false
}

type Props = {
    moduleInputs: any,
    moduleInputsRaw: any,
    moduleOutputs: any,
    moduleOutputsRaw: any,
    moduleParams: any,
    moduleParamsRaw: any,
    moduleHelpAvailable: boolean,
}

const CanvasModuleConfig = ({
    moduleInputs,
    moduleInputsRaw,
    moduleOutputs,
    moduleOutputsRaw,
    moduleParams,
    moduleParamsRaw,
    moduleHelpAvailable,
}: Props) => (
    (moduleHelpAvailable ? (
        <React.Fragment>
            <strong>
                Inputs
            </strong>

            {!isEmpty(moduleInputs) ? (
                <div className={styles.inOutParamsContent}>
                    <ReactMarkdown source={inputs(moduleInputs, moduleInputsRaw)} />
                </div>
            ) : (
                <p>
                    - None
                </p>
            )}

            <strong>
                Parameters
            </strong>

            {!isEmpty(moduleParams) ? (
                <div className={styles.inOutParamsContent}>
                    <ReactMarkdown source={params(moduleParams, moduleParamsRaw)} />
                </div>
            ) : (
                <p>
                    - None
                </p>
            )}

            <strong>
                Outputs
            </strong>

            {!isEmpty(moduleOutputs) ? (
                <div className={styles.inOutParamsContent}>
                    <ReactMarkdown source={outputs(moduleOutputs, moduleOutputsRaw)} />
                </div>
            ) : (
                <p>
                    - None
                </p>
            )}
        </React.Fragment>
    ) : null)
)

export default CanvasModuleConfig
