import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ReactMarkdown from 'react-markdown'

import { createMdSnippet } from '$newdocs/components/utils'
import moduleConfig from './ConstantMap-800.json'

const inputs = !isEmpty(moduleConfig.help.inputs)
    ? createMdSnippet(moduleConfig.help.inputs)
    : false

const outputs = !isEmpty(moduleConfig.help.outputs)
    ? createMdSnippet(moduleConfig.help.outputs)
    : false

const params = !isEmpty(moduleConfig.help.params)
    ? createMdSnippet(moduleConfig.help.params)
    : false

export default () => (
    <section>
        <h3>
            {moduleConfig.name}
        </h3>

        <ReactMarkdown source={moduleConfig.help.helpText} />

        {inputs ? (
            <React.Fragment>
                <strong>
                    Inputs
                </strong>
                <ReactMarkdown source={inputs} />
            </React.Fragment>
        ) : ''}

        {outputs ? (
            <React.Fragment>
                <strong>
                    Outputs
                </strong>
                <ReactMarkdown source={outputs} />
            </React.Fragment>
        ) : ''}

        {params ? (
            <React.Fragment>
                <strong>
                    Parameters
                </strong>
                <ReactMarkdown source={params} />
            </React.Fragment>
        ) : ''}
    </section>
)
