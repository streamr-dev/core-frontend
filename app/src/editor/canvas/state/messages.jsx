import React from 'react'
import { Link } from 'react-router-dom'
import startCase from 'lodash/startCase'
import sortBy from 'lodash/sortBy'

import routes from '$routes'

import * as CanvasState from './index'

export const LEVELS = [
    'none',
    'info',
    'warn',
    'error',
]

function NoFieldsConfiguredMessage(canvas, moduleHash) {
    const streamModule = CanvasState.getModule(canvas, moduleHash)
    const streamParam = streamModule.params.find(({ name }) => name === 'stream')
    const streamId = streamParam && streamParam.value
    const streamLink = routes.streams.show({ id: streamId })
    return {
        level: 'warn',
        title: 'No fields configured.',
        content: (
            <React.Fragment>
                The selected stream should have fields configured.
                {' '}
                <Link to={streamLink}>
                    Configure Fields
                </Link>
            </React.Fragment>
        ),
        canvasId: canvas.id,
        moduleHash,
    }
}

function NoStreamSelectedMessage(canvas, moduleHash) {
    return {
        level: 'warn',
        title: 'No stream selected',
        content: 'Please select a stream',
        canvasId: canvas.id,
        moduleHash,
    }
}

const EMPTY = []
const STREAM_MODULE_ID = 147
const SEND_TO_STREAM_MODULE_ID = 197

/**
 * Adds messages to Stream & Send to Stream modules
 */

function StreamModuleMesssages(canvas, moduleHash) {
    const m = CanvasState.getModuleIfExists(canvas, moduleHash)
    if (!m) { return EMPTY }

    if (m.id === STREAM_MODULE_ID || m.id === SEND_TO_STREAM_MODULE_ID) {
        const streamParam = m.params.find(({ name }) => name === 'stream')
        const streamId = streamParam && streamParam.value
        if (!streamId) {
            // no stream selected
            return [NoStreamSelectedMessage(canvas, moduleHash)]
        }

        // if no fields:
        // stream module *outputs* will be empty
        // send to stream module *inputs* will be empty
        const target = m.id === STREAM_MODULE_ID ? 'outputs' : 'inputs'
        if (!m[target].length) {
            // did not find any fields
            return [NoFieldsConfiguredMessage(canvas, moduleHash)]
        }

        return EMPTY
    }

    return EMPTY
}

/*
 * Looks for errors in canvas.moduleErrors.
 * e.g. java module compileErrors
 */

function ModuleErrorMesssages(canvas, moduleHash) {
    const m = CanvasState.getModuleIfExists(canvas, moduleHash)
    if (!m) { return EMPTY }
    const { moduleErrors = [] } = canvas
    const currentModuleErrors = moduleErrors.filter(({ module }) => module === moduleHash)
    if (!currentModuleErrors.length) { return EMPTY }
    // sort by ascending line number (if line available)
    return sortBy(currentModuleErrors, 'line').reverse().map(({ type, message, line }) => ({
        level: 'error',
        title: startCase(type),
        content: `${line != null ? `Line ${line}: ` : ''}${message}`,
        canvasId: canvas.id,
        moduleHash,
    }))
}

export function getModuleMessages(canvas, moduleHash) {
    const m = CanvasState.getModuleIfExists(canvas, moduleHash)
    if (!m) { return EMPTY }
    return [
        StreamModuleMesssages(canvas, moduleHash),
        ModuleErrorMesssages(canvas, moduleHash),
    ].flat().map((msg) => ({
        subject: CanvasState.getDisplayName(m),
        ...msg,
    }))
}

export function getMaxLevel(moduleMessages) {
    const levelIndex = moduleMessages.reduce((maxLevel, msg) => (
        Math.max(maxLevel, LEVELS.indexOf(msg.level))
    ), 0)
    return LEVELS[levelIndex]
}

export function getCanvasMessages(canvas) {
    return canvas.modules.map((m) => getModuleMessages(canvas, m.hash)).flat()
}
