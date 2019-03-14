/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'
import Meatball from '$shared/components/Meatball'
import Toggle from '$shared/components/Toggle'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import { ModalContainer } from '$editor/shared/components/Modal'
import SvgIcon from '$shared/components/SvgIcon'
import StatusIcon from '$shared/components/StatusIcon'
import DropdownActions from '$shared/components/DropdownActions'
import { RunTabs, RunStates } from '../state'

import RenameInput from '$editor/shared/components/RenameInput'
import TextInput from '$editor/shared/components/TextInput'

import ShareDialog from './ShareDialog'
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
                <ModalContainer modalId="ShareDialog">
                    {({ api: shareDialog }) => (
                        <React.Fragment>
                            <div className={styles.CanvasNameContainer}>
                                <StatusIcon status={isRunning && StatusIcon.OK} className={styles.status} />
                                <RenameInput
                                    inputClassName={styles.canvasName}
                                    title={canvas.name}
                                    value={canvas.name}
                                    onChange={renameCanvas}
                                    innerRef={this.onRenameRef}
                                    disabled={!canEdit}
                                    required
                                />
                                <DropdownActions
                                    title={<Meatball alt="Select" />}
                                    noCaret
                                    className={styles.DropdownMenu}
                                >
                                    <DropdownActions.Item onClick={newCanvas}>New Canvas</DropdownActions.Item>
                                    <DropdownActions.Item onClick={() => shareDialog.open()}>Share</DropdownActions.Item>
                                    <DropdownActions.Item onClick={this.onRename} disabled={!canEdit}>Rename</DropdownActions.Item>
                                    <DropdownActions.Item onClick={() => duplicateCanvas()}>Duplicate</DropdownActions.Item>
                                    <DropdownActions.Item onClick={() => deleteCanvas()} disabled={!canEdit}>Delete</DropdownActions.Item>
                                </DropdownActions>
                            </div>
                            <div>
                                <R.ButtonGroup className={styles.OpenCanvasButton}>
                                    <R.Button onClick={() => this.canvasSearchOpen(!this.state.canvasSearchIsOpen)}>Open</R.Button>
                                    <CanvasSearch
                                        isOpen={this.state.canvasSearchIsOpen}
                                        open={this.canvasSearchOpen}
                                    />
                                </R.ButtonGroup>
                                <R.Button
                                    onClick={() => this.props.moduleSearchOpen(!this.props.moduleSearchIsOpen)}
                                    disabled={!canEdit}
                                >
                                    <SvgIcon name="plus" className={styles.icon} />
                                </R.Button>
                            </div>
                            <div>
                                <R.Button
                                    color="success"
                                    disabled={isWaiting}
                                    onClick={() => (isRunning ? canvasStop() : canvasStart())}
                                >
                                    {isRunning ? 'Stop' : 'Start'}
                                </R.Button>
                                {editorState.runTab !== RunTabs.realtime ? (
                                    <R.UncontrolledDropdown>
                                        <R.DropdownToggle caret className={styles.Hollow} disabled={!canEdit} />
                                        <R.DropdownMenu>
                                            <R.DropdownItem
                                                onClick={() => setSpeed('0')}
                                                active={!settings.speed || settings.speed === '0'}
                                            >
                                                Full
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
                                                Reset &amp; Start
                                            </R.DropdownItem>
                                        </R.DropdownMenu>
                                    </R.UncontrolledDropdown>
                                )}
                            </div>
                            <div>
                                <R.ButtonGroup className={styles.runTabToggle}>
                                    <R.Button
                                        active={editorState.runTab === RunTabs.realtime}
                                        onClick={() => setRunTab(RunTabs.realtime)}
                                        disabled={!canEdit}
                                    >
                                        Realtime
                                    </R.Button>
                                    <R.Button
                                        active={editorState.runTab !== RunTabs.realtime}
                                        onClick={() => setRunTab(RunTabs.historical)}
                                        disabled={!canEdit}
                                    >
                                        Historical
                                    </R.Button>
                                </R.ButtonGroup>
                                {editorState.runTab !== RunTabs.realtime ? (
                                    <div className={styles.runTabInputs}>
                                        <TextInput
                                            placeholder="From"
                                            onChange={this.getOnChangeHistorical('beginDate')}
                                            value={settings.beginDate}
                                            disabled={!canEdit}
                                            required
                                        />
                                        <TextInput
                                            placeholder="To"
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
                                            Save state
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
                            </div>
                            <div>
                                <R.Button
                                    className={cx(styles.ShareButton, styles.Hollow)}
                                    onClick={() => shareDialog.open()}
                                >
                                    <SvgIcon name="share" className={styles.icon} />
                                </R.Button>
                            </div>
                        </React.Fragment>
                    )}
                </ModalContainer>
                <ShareDialog canvas={canvas} />
            </div>
        )
    }
})
