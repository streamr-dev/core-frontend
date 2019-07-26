/* eslint-disable default-case */
import React from 'react'
import cx from 'classnames'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'

import * as services from '../services'
import { createMdSnippet } from '$newdocs/components/utils'

export default class ModuleHelp extends React.Component {
    state = {}

    componentDidMount() {
        this.load()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    componentDidUpdate(prevProps) {
        const { moduleId } = this.props
        // load if no help already (empty string allowed) and module changed.
        if (this.state[moduleId] == null && prevProps.moduleId !== moduleId) {
            this.load()
        }
    }

    async load() {
        const { moduleId } = this.props
        const { moduleName } = this.props

        const help = await services.moduleHelp({
            id: moduleId,
        })

        const cleanedName = moduleName.replace(/\s/g, '').replace(/\(/g, '_').replace(/\)/g, '')
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const helpJson = await require(`$newdocs/content/canvasModules/${cleanedName}-${moduleId}.json`)
        const { helpText } = helpJson.help

        const inputs = !isEmpty(helpJson.help.inputs)
            ? createMdSnippet(helpJson.help.inputs)
            : false

        const outputs = !isEmpty(helpJson.help.outputs)
            ? createMdSnippet(helpJson.help.outputs)
            : false

        const params = !isEmpty(helpJson.help.params)
            ? createMdSnippet(helpJson.help.params)
            : false

        if (this.unmounted) { return }

        this.setState({
            [moduleId]: help,
            helpText,
            inputs,
            outputs,
            params,
        })
    }

    render() {
        const { className } = this.props
        const { inputs, outputs, params } = this.state
        return (
            <div className={cx(className)}>
                <ReactMarkdown source={this.state.helpText} />

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
            </div>
        )
    }
}
