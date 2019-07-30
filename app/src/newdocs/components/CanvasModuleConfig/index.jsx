/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ReactMarkdown from 'react-markdown'

import { createMdSnippet } from '$newdocs/components/utils'

const inputs = (moduleInputs) => (
    !isEmpty(moduleInputs)
        ? createMdSnippet(moduleInputs)
        : false
)

const outputs = (moduleOutputs) => (
    !isEmpty(moduleOutputs)
        ? createMdSnippet(moduleOutputs)
        : false
)

const params = (moduleParams) => (
    !isEmpty(moduleParams)
        ? createMdSnippet(moduleParams)
        : false
)

type Props = {
    moduleInputs: any,
    moduleOutputs: any,
    moduleParams: any
}

const CanvasModuleConfig = ({ moduleInputs, moduleOutputs, moduleParams }: Props) => (
    <React.Fragment>
        {!isEmpty(moduleInputs) ? (
            <React.Fragment>
                <strong>
                    Inputs
                </strong>
                <ReactMarkdown source={inputs(moduleInputs)} />
            </React.Fragment>
        ) : ''}

        {!isEmpty(moduleOutputs) ? (
            <React.Fragment>
                <strong>
                    Outputs
                </strong>
                <ReactMarkdown source={outputs(moduleOutputs)} />
            </React.Fragment>
        ) : ''}

        {!isEmpty(moduleParams) ? (
            <React.Fragment>
                <strong>
                    Parameters
                </strong>
                <ReactMarkdown source={params(moduleParams)} />
            </React.Fragment>
        ) : ''}
    </React.Fragment>
)

export default CanvasModuleConfig
