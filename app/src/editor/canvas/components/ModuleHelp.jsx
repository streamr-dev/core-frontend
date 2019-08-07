import React from 'react'
import CanvasModuleHelp from '$newdocs/components/CanvasModuleHelp'

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
        const { module: m } = this.props

        const cleanedName = m.name.replace(/\s/g, '').replace(/\(/g, '_').replace(/\)/g, '')

        // eslint-disable-next-line global-require, import/no-dynamic-require
        const help = await import(`$newdocs/content/canvasModules/${cleanedName}-${m.id}.jsx`)

        if (this.unmounted) { return }
        this.setState({
            [m.id]: help.default,
        })
    }

    render() {
        const { className, module: m } = this.props
        if (!m) { return null }
        const moduleData = {
            ...this.state[m.id],
            ...m,
        }
        return (
            <div className={className}>
                {!!moduleData && (
                    <CanvasModuleHelp module={moduleData} hideName />
                )}
            </div>
        )
    }
}
