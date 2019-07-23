/* eslint-disable default-case */
import React from 'react'
import cx from 'classnames'
import * as services from '../services'
import { MDXProvider } from '@mdx-js/tag'
import Components from '$newdocs/mdxConfig'
// Dynamic import of correct module :P

// async function getComponent() {
//     const {default} = await import('./my-module')
//     return React.createElement(default.view)
// })

// async function import(moduleId) {
//     try {
//        const module = await import(`$newdocs/content/canvasModules/${moduleId}.mdx`);
//     } catch (error) {
//        console.error('import failed');
//     }
//  }

// async function pageLoader(moduleId) {
//     switch (moduleId) {
//         case '209':
//             // return import(`$newdocs/content/canvasModules/${moduleId}.mdx`)
//             return import('./boop.jsx')
//     }
// }

export default class ModuleHelp extends React.Component {
    state = {}
    // OtherComponent = (React.lazy(() => import(`./${this.props.moduleId}.mdx`)))
    OtherComponent = (React.lazy(() => import(`$newdocs/content/canvasModules/${this.props.moduleId}.mdx`)))

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
        const { className } = this.props
        // const help = this.state[moduleId] || {}
        return (
            <div className={cx(className)}>
                {/* eslint-disable react/no-danger */}
                {/* <div dangerouslySetInnerHTML={{ __html: help.helpText }} /> */}
                <React.Suspense fallback={<div>Loading...</div>}>
                    <MDXProvider components={Components}>
                        <div>
                            <this.OtherComponent />
                        </div>
                    </MDXProvider>
                </React.Suspense>

            </div>
        )
    }
}
