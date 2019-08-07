/* eslint-disable global-require, import/no-dynamic-require, react/no-array-index-key */
// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'

import CanvasModuleConfig from '$newdocs/components/CanvasModuleConfig'

import DocsLayout from '../../DocsLayout'
import { subNav } from '../../DocsLayout/Navigation/navLinks'
import docsStyles from '$newdocs/components/DocsLayout/docsLayout.pcss'

import { canvasModulesCategorised, toAnchor } from './data'

export default function CanvasModules() {
    return (
        <DocsLayout subNav={subNav.canvasModules}>
            <Helmet title="Canvas Modules | Streamr Docs" />
            {(// $FlowFixMe
                Object.entries(canvasModulesCategorised).map(([category, helps]: [string, any[]]) => (
                    <section id={toAnchor(category)} className={docsStyles.canvasModule}>
                        <h2>{category}</h2>
                        {helps.map((m) => (
                            <section key={m.id}>
                                <h3>{m.name}</h3>
                                <ReactMarkdown source={m.help.helpText} />
                                <CanvasModuleConfig module={m} />
                            </section>
                        ))}
                    </section>
                ))
            )}
        </DocsLayout>
    )
}
