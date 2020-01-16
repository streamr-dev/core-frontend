/* eslint-disable react/no-unused-state */

import React from 'react'

import { Context as UndoContext } from '$shared/contexts/Undo'

export default class UndoControls extends React.Component {
    static contextType = UndoContext

    onKeyDown = (event) => {
        let { disabled } = this.props
        if (typeof disabled === 'function') {
            disabled = disabled(this.context)
        }
        if (disabled) { return } // noop if disabled

        // ignore if focus is in an input, select, textarea, etc
        if (document.activeElement) {
            const tagName = document.activeElement.tagName.toLowerCase()
            if (tagName === 'input'
                || tagName === 'select'
                || tagName === 'textarea'
                || document.activeElement.isContentEditable
            ) {
                return
            }
        }

        const metaKey = event.ctrlKey || event.metaKey
        if (!metaKey) { return } // all shortcuts require meta key

        if (event.code === 'KeyZ') {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            if (!event.shiftKey) { // Meta+Z – Undo
                this.context.undo()
            } else { // Meta+Shift+Z – Redo
                this.context.redo()
            }
        }

        if (event.code === 'KeyY') { // Meta+Y – Redo (windows style)
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
            this.context.redo()
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    render() {
        return this.props.children || null
    }
}
