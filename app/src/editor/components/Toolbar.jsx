/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import { save } from '../services'
import styles from './Toolbar.pcss'

class CanvasRename extends React.Component {
    state = {
        value: '',
        hasFocus: false,
    }

    static getDerivedStateFromProps(props, state) {
        if (state.hasFocus) {
            return null // don't update while user is editing
        }

        return {
            value: props.canvas.name,
        }
    }

    onFocus = (event) => {
        event.target.select() // select all input text on focus
        this.setState({
            hasFocus: true,
        })
    }

    onBlur = () => {
        const value = this.state.value.trim()
        // only rename if there's a value and it's different
        if (value && value !== this.props.canvas.name) {
            this.props.renameCanvas(value)
        }
        this.setState({
            hasFocus: false,
        })
    }

    onChange = (event) => {
        const { value } = event.target
        this.setState({ value })
    }

    onInnerRef = (el) => {
        this.el = el
        if (this.props.innerRef) {
            this.props.innerRef(el)
        }
    }

    render() {
        return (
            <div className={cx(styles.CanvasRenameContainer)} onDoubleClick={() => this.el.focus()}>
                <R.Input
                    className={styles.CanvasRename}
                    innerRef={this.onInnerRef}
                    value={this.state.value}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                />
            </div>
        )
    }
}

export default class CanvasToolbar extends React.Component {
    onRenameRef = (el) => {
        this.renameEl = el
    }

    onRename = () => {
        this.renameEl.focus() // just focus the input to start renaming
    }

    render() {
        const { canvas, className, duplicateCanvas } = this.props
        if (!canvas) { return null }
        return (
            <div className={cx(className, styles.CanvasToolbar)}>
                <R.ButtonGroup className={cx(styles.Hollow, styles.CanvasNameContainer)}>
                    <CanvasRename {...this.props} innerRef={this.onRenameRef} />
                    <R.UncontrolledDropdown>
                        <R.DropdownToggle className={styles.Hollow} caret />
                        <R.DropdownMenu>
                            <R.DropdownItem>New Canvas</R.DropdownItem>
                            <R.DropdownItem>Share</R.DropdownItem>
                            <R.DropdownItem onClick={this.onRename}>Rename</R.DropdownItem>
                            <R.DropdownItem onClick={() => duplicateCanvas()}>Duplicate</R.DropdownItem>
                            <R.DropdownItem>Delete</R.DropdownItem>
                        </R.DropdownMenu>
                    </R.UncontrolledDropdown>
                </R.ButtonGroup>
                <R.ButtonGroup>
                    <R.UncontrolledButtonDropdown>
                        <R.DropdownToggle>
                            Open
                        </R.DropdownToggle>
                        <R.DropdownMenu>
                            <R.DropdownItem>Canvas 1</R.DropdownItem>
                            <R.DropdownItem>Canvas 2</R.DropdownItem>
                        </R.DropdownMenu>
                    </R.UncontrolledButtonDropdown>
                    <R.Button onClick={() => save(canvas)}>Save</R.Button>
                </R.ButtonGroup>
                <R.Button onClick={() => this.props.showModuleSearch()}>+</R.Button>
                <div>
                    <R.Button color="success">Start</R.Button>
                    <R.UncontrolledDropdown>
                        <R.DropdownToggle caret className={styles.Hollow} />
                        <R.DropdownMenu>
                            <R.DropdownItem>Reset &amp; Start</R.DropdownItem>
                        </R.DropdownMenu>
                    </R.UncontrolledDropdown>
                </div>
                <R.ButtonGroup>
                    <R.Button>Realtime</R.Button>
                    <R.Button>Historical</R.Button>
                </R.ButtonGroup>
                <div className="d-flex">
                    <R.Input placeholder="From" />
                    <R.Input placeholder="To" />
                </div>
                <R.Button className={cx(styles.ShareButton, styles.Hollow)}>
                    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40">
                        <g fill="none" fillRule="evenodd">
                            <rect width="40" height="40" fill="#FFF" rx="4" />
                            <g stroke="#CDCDCD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                                <path d="M28.788 14.375h-7.013c-1.408 0-2.55 1.12-2.55 2.5V20" />
                                <path d="M24.963 18.125l3.825-3.75-3.825-3.75M26.238 21.875v6.25c0 .69-.571 1.25-1.275 1.25H13.486c-.704
                                    0-1.275-.56-1.275-1.25v-10c0-.69.571-1.25 1.275-1.25H15.4"
                                />
                            </g>
                        </g>
                    </svg>
                </R.Button>
            </div>
        )
    }
}
