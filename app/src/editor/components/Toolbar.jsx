/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'

import CanvasRename from './CanvasRename'
import CanvasSearch from './CanvasSearch'

import styles from './Toolbar.pcss'

export default class CanvasToolbar extends React.Component {
    state = {
        canvasSearchIsOpen: false,
    }

    onRenameRef = (el) => {
        this.renameEl = el
    }

    onRename = () => {
        this.renameEl.focus() // just focus the input to start renaming
    }

    canvasSearchOpen = (show = true) => {
        this.setState({
            canvasSearchIsOpen: !!show,
        })
    }

    onKeyDown = (event) => {
        if (this.state.canvasSearchIsOpen && event.code === 'Escape') {
            this.canvasSearchOpen(false)
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
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
                <R.ButtonGroup style={{ position: 'relative' }}>
                    <R.Button onClick={() => this.canvasSearchOpen(!this.state.canvasSearchIsOpen)}>Open</R.Button>
                    <CanvasSearch
                        isOpen={this.state.canvasSearchIsOpen}
                        open={this.canvasSearchOpen}
                    />
                </R.ButtonGroup>
                <R.Button onClick={() => this.props.moduleSearchOpen(!this.props.moduleSearchIsOpen)}>+</R.Button>
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
