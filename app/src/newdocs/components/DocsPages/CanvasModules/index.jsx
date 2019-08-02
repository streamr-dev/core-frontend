/* eslint-disable global-require, import/no-dynamic-require, react/no-array-index-key */
// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'

import CanvasModuleConfig from '$newdocs/components/CanvasModuleConfig'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import docsStyles from '$newdocs/components/DocsLayout/docsLayout.pcss'

type Props = {}
type State = {
    markdown: [],
    configNames: [],
    configInputs: [],
    configInputsRaw: [],
    configOutputs: [],
    configOutputsRaw: [],
    configParams: [],
    configParamsRaw: [],
}

const importAll = (r) => r.keys().map(r)
// $FlowFixMe
const markdownFileNames = importAll(require.context('$newdocs/content/canvasModules', false, /\.md$/))

const noHelpTxt = 'There is no documentation for this module at this time.'

export default class CanvasModules extends React.Component<Props, State> {
    state = {}

    async componentDidMount() {
        await this.load()
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    unmounted: boolean = false

    async load() {
        const markdown = await Promise.all(markdownFileNames.map((filename) => fetch(filename).then((res) => res.text())))
            .catch((err) => console.error(err))

        const inputs = await Promise.all(markdownFileNames.map(async (cn, idx) =>
            require(`$newdocs/content/canvasModules${markdownFileNames[idx].slice(0, -3)}.jsx`).default.help.inputs))
            .catch((err) => console.error(err))

        const inputsRaw = await Promise.all(markdownFileNames.map(async (cn, idx) =>
            require(`$newdocs/content/canvasModules${markdownFileNames[idx].slice(0, -3)}.jsx`).default.inputs))
            .catch((err) => console.error(err))

        const outputs = await Promise.all(markdownFileNames.map(async (cn, idx) =>
            require(`$newdocs/content/canvasModules${markdownFileNames[idx].slice(0, -3)}.jsx`).default.help.outputs))
            .catch((err) => console.error(err))

        const outputsRaw = await Promise.all(markdownFileNames.map(async (cn, idx) =>
            require(`$newdocs/content/canvasModules${markdownFileNames[idx].slice(0, -3)}.jsx`).default.outputs))
            .catch((err) => console.error(err))

        const params = await Promise.all(markdownFileNames.map(async (cn, idx) =>
            require(`$newdocs/content/canvasModules${markdownFileNames[idx].slice(0, -3)}.jsx`).default.help.params))
            .catch((err) => console.error(err))

        const paramsRaw = await Promise.all(markdownFileNames.map(async (cn, idx) =>
            require(`$newdocs/content/canvasModules${markdownFileNames[idx].slice(0, -3)}.jsx`).default.params))
            .catch((err) => console.error(err))

        const names = await Promise.all(markdownFileNames.map(async (cn, idx) =>
            require(`$newdocs/content/canvasModules${markdownFileNames[idx].slice(0, -3)}.jsx`).default.name))
            .catch((err) => console.error(err))

        if (this.unmounted) { return }
        this.setState((state) => ({
            ...state,
            markdown,
            configNames: names,
            configInputs: inputs,
            configInputsRaw: inputsRaw,
            configOutputs: outputs,
            configOutputsRaw: outputsRaw,
            configParams: params,
            configParamsRaw: paramsRaw,
        }))
    }

    render() {
        const {
            markdown,
            configNames,
            configInputs,
            configInputsRaw,
            configOutputs,
            configOutputsRaw,
            configParams,
            configParamsRaw,
        } = this.state
        return (
            <DocsLayout subNav={subNav.canvasModules}>
                <Helmet title="Canvas Modules | Streamr Docs" />
                <section id="boolean" className={docsStyles.canvasModule}>
                    <h2>Boolean Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (BooleanCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="custom-modules" className={docsStyles.canvasModule}>
                    <h2>Custom Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (Custom ModulesCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="input" className={docsStyles.canvasModule}>
                    <h2>Input Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (InputCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="integrations" className={docsStyles.canvasModule}>
                    <h2>Integration Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (IntegrationsCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="list" className={docsStyles.canvasModule}>
                    <h2>List Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (ListCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="map" className={docsStyles.canvasModule}>
                    <h2>Map Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (MapCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="streams" className={docsStyles.canvasModule}>
                    <h2>Streams Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (StreamsCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="text" className={docsStyles.canvasModule}>
                    <h2>Text Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (TextCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="time-and-date" className={docsStyles.canvasModule}>
                    <h2>Text Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (Time & DateCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="time-series" className={docsStyles.canvasModule}>
                    <h2>Time Series Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (TimeSeriesCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="utils" className={docsStyles.canvasModule}>
                    <h2>Utility Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (UtilsCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
                <section id="visualizations" className={docsStyles.canvasModule}>
                    <h2>Visualizations Modules</h2>
                    {!!markdown &&
                        markdown.map((mdContent, idx) => {
                            if (mdContent.includes('[comment]: # (VisualizationsCanvasModule)')) {
                                return (
                                    <section key={idx}>
                                        <h3>{configNames && configNames[idx]}</h3>
                                        <ReactMarkdown source={mdContent} />
                                        <CanvasModuleConfig
                                            moduleInputs={configInputs && configInputs[idx]}
                                            moduleInputsRaw={configInputsRaw && configInputsRaw[idx]}
                                            moduleOutputs={configOutputs && configOutputs[idx]}
                                            moduleOutputsRaw={configOutputsRaw && configOutputsRaw[idx]}
                                            moduleParams={configParams && configParams[idx]}
                                            moduleParamsRaw={configParamsRaw && configParamsRaw[idx]}
                                            moduleHelpAvailable={!mdContent.includes(noHelpTxt)}
                                        />
                                    </section>
                                )
                            }
                            return false
                        })
                    }
                </section>
            </DocsLayout>
        )
    }
}
