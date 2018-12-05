/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'
import Meatball from '$shared/components/Meatball'
import Toggle from '$shared/components/Toggle'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import { Translate, I18n } from 'react-redux-i18n'

import { RunTabs, RunStates } from '../state'

import RenameInput from './RenameInput'
import TextInput from './TextInput'
import CanvasSearch from './CanvasSearch'

import styles from './Toolbar.pcss'

export default withErrorBoundary(ErrorComponentView)(class CanvasToolbar extends React.PureComponent {
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
        this.props.setHistorical({
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
            canvasStart,
            canvasStop,
            newCanvas,
            setSpeed,
            isWaiting,
        } = this.props

        if (!canvas) { return null }

        const isRunning = canvas.state === RunStates.Running
        const canEdit = !isWaiting && !isRunning
        const { settings = {} } = canvas
        const { editorState = {} } = settings
        return (
            <div className={cx(className, styles.CanvasToolbar)}>
                <R.ButtonGroup className={cx(styles.Hollow, styles.CanvasNameContainer)}>
                    <RenameInput
                        value={canvas.name}
                        onChange={renameCanvas}
                        innerRef={this.onRenameRef}
                        disabled={!canEdit}
                        required
                    />
                    <R.UncontrolledDropdown>
                        <R.DropdownToggle className={styles.Hollow}>
                            <Meatball />
                        </R.DropdownToggle>
                        <R.DropdownMenu>
                            <R.DropdownItem onClick={newCanvas}><Translate value="editor.canvas.new" /></R.DropdownItem>
                            <R.DropdownItem><Translate value="editor.canvas.share" /></R.DropdownItem>
                            <R.DropdownItem onClick={this.onRename} disabled={!canEdit}><Translate value="editor.canvas.rename" /></R.DropdownItem>
                            <R.DropdownItem onClick={() => duplicateCanvas()}><Translate value="editor.canvas.duplicate" /></R.DropdownItem>
                            <R.DropdownItem
                                onClick={() => deleteCanvas()}
                                disabled={!canEdit}
                            >
                                <Translate value="editor.canvas.delete" />
                            </R.DropdownItem>
                        </R.DropdownMenu>
                    </R.UncontrolledDropdown>
                </R.ButtonGroup>
                <R.ButtonGroup style={{ position: 'relative' }}>
                    <R.Button onClick={() => this.canvasSearchOpen(!this.state.canvasSearchIsOpen)}>
                        <Translate value="editor.canvas.open" />
                    </R.Button>
                    <CanvasSearch
                        isOpen={this.state.canvasSearchIsOpen}
                        open={this.canvasSearchOpen}
                    />
                </R.ButtonGroup>
                <R.Button
                    onClick={() => this.props.moduleSearchOpen(!this.props.moduleSearchIsOpen)}
                    disabled={!canEdit}
                >
                    +
                </R.Button>
                <div>
                    <R.Button
                        color="success"
                        disabled={isWaiting}
                        onClick={() => (isRunning ? canvasStop() : canvasStart())}
                    >
                        {isRunning ? <Translate value="editor.canvas.stop" /> : <Translate value="editor.canvas.start" />}
                    </R.Button>
                    {editorState.runTab !== RunTabs.realtime ? (
                        <R.UncontrolledDropdown>
                            <R.DropdownToggle caret className={styles.Hollow} disabled={!canEdit} />
                            <R.DropdownMenu>
                                <R.DropdownItem
                                    onClick={() => setSpeed('0')}
                                    active={!settings.speed || settings.speed === '0'}
                                >
                                    <Translate value="editor.canvas.speed.full" />
                                </R.DropdownItem>
                                <R.DropdownItem
                                    onClick={() => setSpeed('1')}
                                    active={settings.speed === '1'}
                                >
                                    1x
                                </R.DropdownItem>
                                <R.DropdownItem
                                    onClick={() => setSpeed('10')}
                                    active={settings.speed === '10'}
                                >
                                    10x
                                </R.DropdownItem>
                                <R.DropdownItem
                                    onClick={() => setSpeed('100')}
                                    active={settings.speed === '100'}
                                >
                                    100x
                                </R.DropdownItem>
                                <R.DropdownItem
                                    onClick={() => setSpeed('1000')}
                                    active={settings.speed === '1000'}
                                >
                                    1000x
                                </R.DropdownItem>
                            </R.DropdownMenu>
                        </R.UncontrolledDropdown>
                    ) : (
                        <R.UncontrolledDropdown>
                            <R.DropdownToggle caret className={styles.Hollow} disabled={!canEdit} />
                            <R.DropdownMenu>
                                <R.DropdownItem
                                    onClick={() => canvasStart({ clearState: true })}
                                    disabled={!canvas.serialized || !canEdit}
                                >
                                    <Translate value="editor.canvas.resetAndStart" />
                                </R.DropdownItem>
                            </R.DropdownMenu>
                        </R.UncontrolledDropdown>
                    )}
                </div>
                <R.ButtonGroup className={styles.runTabToggle}>
                    <R.Button
                        active={editorState.runTab === RunTabs.realtime}
                        onClick={() => setRunTab(RunTabs.realtime)}
                        disabled={!canEdit}
                    >
                        <Translate value="editor.canvas.realtime" />
                    </R.Button>
                    <R.Button
                        active={editorState.runTab !== RunTabs.realtime}
                        onClick={() => setRunTab(RunTabs.historical)}
                        disabled={!canEdit}
                    >
                        <Translate value="editor.canvas.historical" />
                    </R.Button>
                </R.ButtonGroup>
                {editorState.runTab !== RunTabs.realtime ? (
                    <div className={styles.runTabInputs}>
                        <TextInput
                            placeholder={I18n.t('editor.canvas.historical.from')}
                            onChange={this.getOnChangeHistorical('beginDate')}
                            value={settings.beginDate}
                            disabled={!canEdit}
                            required
                        />
                        <TextInput
                            placeholder={I18n.t('editor.canvas.historical.to')}
                            onChange={this.getOnChangeHistorical('endDate')}
                            value={settings.endDate}
                            disabled={!canEdit}
                            required
                        />
                    </div>
                ) : (
                    <div className={styles.saveStateToggleSection}>
                        {/* eslint-disable react/no-unknown-property */}
                        <R.Label
                            for="saveStateToggle"
                            className={styles.saveStateToggleLabel}
                        >
                            <Translate value="editor.canvas.saveState" />
                        </R.Label>
                        {/* eslint-enable react/no-unknown-property */}
                        <Toggle
                            id="saveStateToggle"
                            className={styles.saveStateToggle}
                            value={settings.serializationEnabled === 'true' /* yes, it's a string. legacy compatibility */}
                            onChange={(value) => setSaveState(value)}
                            disabled={!canEdit}
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
})
