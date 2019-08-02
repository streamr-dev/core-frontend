/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ReactMarkdown from 'react-markdown'

import createMdSnippet from '$newdocs/utils/createMdSnippet'
import styles from './canvasModuleConfig.pcss'

const inputs = (moduleInputs, moduleInputsRaw) => {
    const typeArray = []

    if (moduleInputs && moduleInputsRaw) {
        Object.entries(moduleInputs).map(([key]) =>
            moduleInputsRaw.map((ins) => {
                if (ins.name === key) {
                    typeArray.push(ins.type)
                }
                return false
            }))
    }

    return !isEmpty(moduleInputs)
        ? createMdSnippet(moduleInputs, typeArray)
        : false
}

const outputs = (moduleOutputs, moduleOutputsRaw) => {
    const typeArray = []

    if (moduleOutputs && moduleOutputsRaw) {
        Object.entries(moduleOutputs).map(([key]) =>
            moduleOutputsRaw.map((outs) => {
                if (outs.name === key) {
                    typeArray.push(outs.type)
                }
                return false
            }))
    }

    return !isEmpty(moduleOutputs)
        ? createMdSnippet(moduleOutputs, typeArray)
        : false
}

const params = (moduleParams, moduleParamsRaw) => {
    const typeArray = []

    if (moduleParams && moduleParamsRaw) {
        Object.entries(moduleParams).map(([key]) =>
            moduleParamsRaw.map((pms) => {
                if (pms.name === key) {
                    typeArray.push(pms.type)
                }
                return false
            }))
    }

    return !isEmpty(moduleParams)
        ? createMdSnippet(moduleParams, typeArray)
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
