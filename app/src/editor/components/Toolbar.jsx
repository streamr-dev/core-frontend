/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'
import Meatball from '$shared/components/Meatball'
import Toggle from '$shared/components/Toggle'

import { RunTabs } from '../state'

import RenameInput from './RenameInput'
import TextInput from './TextInput'
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

    getOnChangeHistorical = (key) => (value) => {
        const { settings } = this.props.canvas
        const { beginDate, endDate } = settings
        this.props.setHistorical({
            beginDate,
            endDate,
            [key]: value,
        })
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    render() {
        const {
            canvas,
            className,
            duplicateCanvas,
            deleteCanvas,
            setSaveState,
            setRunTab,
            renameCanvas,
            newCanvas,
        } = this.props

        if (!canvas) { return null }

        const { settings = {} } = canvas
        const { editorState = {} } = settings
        return (
            <div className={cx(className, styles.CanvasToolbar)}>
                <R.ButtonGroup className={cx(styles.Hollow, styles.CanvasNameContainer)}>
                    <RenameInput value={canvas.name} onChange={renameCanvas} innerRef={this.onRenameRef} />
                    <R.UncontrolledDropdown>
                        <R.DropdownToggle className={styles.Hollow}>
                            <Meatball />
                        </R.DropdownToggle>
                        <R.DropdownMenu>
                            <R.DropdownItem onClick={newCanvas}>New Canvas</R.DropdownItem>
                            <R.DropdownItem>Share</R.DropdownItem>
                            <R.DropdownItem onClick={this.onRename}>Rename</R.DropdownItem>
                            <R.DropdownItem onClick={() => duplicateCanvas()}>Duplicate</R.DropdownItem>
                            <R.DropdownItem onClick={() => deleteCanvas()}>Delete</R.DropdownItem>
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
                <R.ButtonGroup className={styles.runTabToggle}>
                    <R.Button
                        active={editorState.runTab === RunTabs.realtime}
                        onClick={() => setRunTab(RunTabs.realtime)}
                    >
                        Realtime
                    </R.Button>
                    <R.Button
                        active={editorState.runTab !== RunTabs.realtime}
                        onClick={() => setRunTab(RunTabs.historical)}
                    >
                        Historical
                    </R.Button>
                </R.ButtonGroup>
                {editorState.runTab === RunTabs.historical ? (
                    <div className={styles.runTabInputs}>
                        <TextInput
                            placeholder="From"
                            onChange={this.getOnChangeHistorical('beginDate')}
                            value={settings.beginDate}
                        />
                        <TextInput
                            placeholder="To"
                            onChange={this.getOnChangeHistorical('endDate')}
                            value={settings.endDate}
                        />
                    </div>
                ) : (
                    <div className={styles.saveStateToggleSection}>
                        {/* eslint-disable react/no-unknown-property */}
                        <R.Label
                            for="saveStateToggle"
                            className={styles.saveStateToggleLabel}
                        >
                            Save state
                        </R.Label>
                        {/* eslint-enable react/no-unknown-property */}
                        <Toggle
                            id="saveStateToggle"
                            className={styles.saveStateToggle}
                            value={settings.serializationEnabled === 'true' /* yes, it's a string. legacy compatibility */}
                            onChange={(value) => setSaveState(value)}
                        />
                    </div>
                )}
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
