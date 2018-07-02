// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ShortcutManager, Shortcuts } from 'react-shortcuts'

import { object } from 'prop-types'
import type { Node } from 'react'
import { updateAndSaveCurrentDashboard } from '../../../actions/dashboard'

import styles from './shortcutHandler.pcss'

type DispatchProps = {
    updateAndSaveCurrentDashboard: () => void
}

type GivenProps = {
    children: Node
}

type Props = DispatchProps & GivenProps

export class ShortcutHandler extends Component<Props> {
    static keymap = {
        MAIN: {
            SAVE: ['ctrl+s', 'command+s'],
        },
    }

    static childContextTypes = {
        shortcuts: object,
    }

    getChildContext() {
        this.shortcutManager = this.shortcutManager || new ShortcutManager(ShortcutHandler.keymap)
        return {
            shortcuts: this.shortcutManager,
        }
    }

    shortcutManager: ShortcutManager

    handleShortcuts = (action: 'SAVE', event: Event) => {
        switch (action) {
            case 'SAVE': {
                event.preventDefault()
                this.props.updateAndSaveCurrentDashboard()
                break
            }
            default:
        }
    }

    render() {
        return (
            <Shortcuts name="MAIN" handler={this.handleShortcuts} className={styles.shortcutHandler}>
                {this.props.children}
            </Shortcuts>
        )
    }
}

export const mapDispatchToProps = (dispatch: Function) => ({
    updateAndSaveCurrentDashboard() {
        dispatch(updateAndSaveCurrentDashboard())
    },
})

export default connect(null, mapDispatchToProps)(ShortcutHandler)
