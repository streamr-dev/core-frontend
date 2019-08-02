import React from 'react'
import cx from 'classnames'
import ReactMarkdown from 'react-markdown'

import CanvasModuleConfig from '$newdocs/components/CanvasModuleConfig'

const noHelpTxt = 'There is no documentation for this module at this time.'

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
        const { moduleId, moduleName } = this.props

        const cleanedName = moduleName.replace(/\s/g, '').replace(/\(/g, '_').replace(/\)/g, '')

        // eslint-disable-next-line global-require, import/no-dynamic-require
        const helpJson = await require(`$newdocs/content/canvasModules/${cleanedName}-${moduleId}.jsx`)
        const { help } = helpJson.default

        // eslint-disable-next-line global-require, import/no-dynamic-require
        const helpMdPath = await require(`$newdocs/content/canvasModules/${cleanedName}-${moduleId}.md`)
        const helpMdText = await fetch(helpMdPath).then((res) => res.text())

        if (this.unmounted) { return }
        this.setState({
            inputs: help.inputs,
            inputsRaw: helpJson.default.inputs,
            outputs: help.outputs,
            outputsRaw: helpJson.default.outputs,
            params: help.params,
            paramsRaw: helpJson.default.params,
            helpMdText,
        })
    }

    render() {
        const { className } = this.props
        const {
            inputs,
            inputsRaw,
            outputs,
            outputsRaw,
            params,
            paramsRaw,
            helpMdText,
        } = this.state
        return (
            <div className={cx(className)}>
                <ReactMarkdown source={helpMdText} />
                <CanvasModuleConfig
                    moduleInputs={inputs || {}}
                    moduleInputsRaw={inputsRaw || []}
                    moduleOutputs={outputs || {}}
                    moduleOutputsRaw={outputsRaw || []}
                    moduleParams={params || {}}
                    moduleParamsRaw={paramsRaw || []}
                    moduleHelpAvailable={helpMdText && !helpMdText.includes(noHelpTxt)}
                />
            </div>
        )
    }
}
