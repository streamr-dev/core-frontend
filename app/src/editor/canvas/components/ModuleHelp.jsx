/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import React from 'react'
import cx from 'classnames'
import { MDXProvider } from '@mdx-js/react'
import Components from '$newdocs/mdxConfig'

import CanvasModuleConfig from '$newdocs/components/CanvasModuleConfig'

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

        const cleanedName = moduleName.replace(/\s/g, '').replace(/\(/g, '_').replace(/\)/g, '')
        // eslint-disable-next-line global-require, import/no-dynamic-require
        // const helpText = await require(`$newdocs/content/canvasModules/${cleanedName}-${moduleId}.mdx`)
        const OtherComponent = (React.lazy(() => import(`$newdocs/content/canvasModules/${cleanedName}-${moduleId}.mdx`)))
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const helpJson = await require(`$newdocs/content/canvasModules/${cleanedName}-${moduleId}.jsx`)
        const { help } = helpJson.default

        if (this.unmounted) { return }
        debugger
        this.setState({
            inputs: help.inputs,
            outputs: help.outputs,
            params: help.params,
        })
    }

    render() {
        const { className } = this.props
        const { inputs, outputs, params } = this.state
        return (
            <div className={cx(className)}>
                {/* <ReactMarkdown source={this.state.helpText} /> */}
                <MDXProvider components={Components}>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <MDXProvider components={Components}>
                            {this.OtherComponent}
                        </MDXProvider>
                    </React.Suspense>
                </MDXProvider>
                <CanvasModuleConfig
                    moduleInputs={inputs || {}}
                    moduleOutputs={outputs || {}}
                    moduleParams={params || {}}
                />
            </div>
        )
    }
}
