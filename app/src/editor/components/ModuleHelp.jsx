import React from 'react'
import cx from 'classnames'
import * as services from '../services'

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
        const help = await services.moduleHelp({
            id: moduleId,
        })
        if (this.unmounted) { return }
        this.setState({
            [moduleId]: help,
        })
    }

    render() {
        const { className, moduleId } = this.props
        const help = this.state[moduleId] || {}
        return (
            <div className={cx(className)}>
                {/* eslint-disable react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: help.helpText }} />
            </div>
        )
    }
}
