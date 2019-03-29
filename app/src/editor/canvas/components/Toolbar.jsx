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
import Tooltip from '$shared/components/Tooltip'
import WithCalendar from '$shared/components/WithCalendar'
import dateFormatter from '$utils/dateFormatter'
import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import { RunTabs, RunStates } from '../state'
import Toolbar from '$editor/shared/components/Toolbar'

import ShareDialog from './ShareDialog'
import CanvasSearch from './CanvasSearch'

import styles from './Toolbar.pcss'

export default withErrorBoundary(ErrorComponentView)(class CanvasToolbar extends React.PureComponent {
    state = {
        canvasSearchIsOpen: false,
        runButtonDropdownOpen: false,
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

    onToggleRunButtonMenu = () => {
        this.setState(({ runButtonDropdownOpen }) => ({
            runButtonDropdownOpen: !runButtonDropdownOpen,
        }))
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

        const { runButtonDropdownOpen, canvasSearchIsOpen } = this.state
        const isRunning = canvas.state === RunStates.Running
        const canEdit = !isWaiting && !isRunning
        const { settings = {} } = canvas
        const { editorState = {} } = settings
        return (
            <div className={cx(className, styles.CanvasToolbar)}>
                <ModalContainer modalId="ShareDialog">
                    {({ api: shareDialog }) => (
                        <React.Fragment>
                            <div className={styles.ToolbarLeft}>
                                <UseState initialValue={false}>
                                    {(editing, setEditing) => (
                                        <div className={styles.CanvasNameContainer}>
                                            <StatusIcon status={isRunning && StatusIcon.OK} className={styles.status} />
                                            <EditableText
                                                className={Toolbar.styles.entityName}
                                                disabled={!canEdit}
                                                editing={editing}
                                                onChange={renameCanvas}
                                                setEditing={setEditing}
                                                title={canvas.name}
                                            >
                                                {canvas.name}
                                            </EditableText>
                                            <DropdownActions
                                                title={<Meatball alt="Select" />}
                                                noCaret
                                                className={styles.DropdownMenu}
                                            >
                                                <DropdownActions.Item onClick={newCanvas}>New Canvas</DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => shareDialog.open()}>Share</DropdownActions.Item>
                                                <DropdownActions.Item
                                                    onClick={() => setEditing(true)}
                                                    disabled={!canEdit}
                                                >
                                                    Rename
                                                </DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => duplicateCanvas()}>Duplicate</DropdownActions.Item>
                                                <DropdownActions.Item onClick={() => deleteCanvas()} disabled={!canEdit}>Delete</DropdownActions.Item>
                                            </DropdownActions>
                                        </div>
                                    )}
                                </UseState>
                            </div>
                            <div className={styles.ToolbarLeft}>
                                <div style={{ position: 'relative' }}>
                                    <R.Button
                                        className={cx(styles.ToolbarButton, styles.OpenCanvasButton)}
                                        onClick={() => this.canvasSearchOpen(!this.state.canvasSearchIsOpen)}
                                    >
                                        Open
                                    </R.Button>
                                    <CanvasSearch
                                        isOpen={canvasSearchIsOpen}
                                        open={this.canvasSearchOpen}
                                    />
                                    <Tooltip value="Add module">
                                        <R.Button
                                            className={styles.ToolbarButton}
                                            onClick={() => this.props.moduleSearchOpen(!this.props.moduleSearchIsOpen)}
                                            disabled={!canEdit}
                                        >
                                            <SvgIcon name="plus" className={styles.icon} />
                                        </R.Button>
                                    </Tooltip>
                                </div>
                            </div>
                            <div>
                                <R.ButtonGroup
                                    className={cx(styles.RunButtonGroup, {
                                        [styles.RunButtonStopped]: !isRunning,
                                        [styles.RunButtonRunning]: !!isRunning,
                                    })}
                                >
                                    <R.Button
                                        disabled={isWaiting}
                                        onClick={() => (isRunning ? canvasStop() : canvasStart())}
                                        className={styles.RunButton}
                                    >
                                        {isRunning ? 'Stop' : 'Run'}
                                    </R.Button>
                                    {editorState.runTab !== RunTabs.realtime ? (
                                        <R.ButtonDropdown
                                            isOpen={runButtonDropdownOpen}
                                            toggle={this.onToggleRunButtonMenu}
                                            className={styles.RunDropdownButton}
                                        >
                                            <R.DropdownToggle disabled={!canEdit} caret>
                                                {!runButtonDropdownOpen && (
                                                    <SvgIcon name="caretUp" />
                                                )}
                                                {runButtonDropdownOpen && (
                                                    <SvgIcon name="caretDown" />
                                                )}
                                            </R.DropdownToggle>
                                            <R.DropdownMenu className={styles.RunButtonMenu} right>
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
                                        </R.ButtonDropdown>
                                    ) : (
                                        <R.ButtonDropdown
                                            isOpen={runButtonDropdownOpen}
                                            toggle={this.onToggleRunButtonMenu}
                                            className={styles.RunDropdownButton}
                                        >
                                            <R.DropdownToggle disabled={!canEdit} caret>
                                                {!runButtonDropdownOpen && (
                                                    <SvgIcon name="caretUp" />
                                                )}
                                                {runButtonDropdownOpen && (
                                                    <SvgIcon name="caretDown" />
                                                )}
                                            </R.DropdownToggle>
                                            <R.DropdownMenu className={cx(styles.RunButtonMenu, styles.RealtimeRunButtonMenu)} right>
                                                <R.DropdownItem
                                                    onClick={() => canvasStart({ clearState: true })}
                                                    disabled={!canvas.serialized || !canEdit}
                                                >
                                                    Reset &amp; Start
                                                </R.DropdownItem>
                                            </R.DropdownMenu>
                                        </R.ButtonDropdown>
                                    )}
                                </R.ButtonGroup>
                            </div>
                            <div className={styles.ToolbarRight}>
                                <div className={styles.StateSelectorContainer}>
                                    <div className={styles.StateSelector}>
                                        <div className={styles.runTabToggle}>
                                            <button
                                                type="button"
                                                onClick={() => setRunTab(RunTabs.realtime)}
                                                disabled={!canEdit}
                                                className={cx(styles.realTimeButton, {
                                                    [styles.StateSelectorActive]: editorState.runTab === RunTabs.realtime,
                                                })}
                                            >
                                                Realtime
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRunTab(RunTabs.historical)}
                                                disabled={!canEdit}
                                                className={cx(styles.historicalButton, {
                                                    [styles.StateSelectorActive]: editorState.runTab !== RunTabs.realtime,
                                                })}
                                            >
                                                Historical
                                            </button>
                                        </div>
                                        {editorState.runTab !== RunTabs.realtime ? (
                                            <div className={styles.runTabValueToggle}>
                                                <WithCalendar
                                                    date={!!settings.beginDate && new Date(settings.beginDate)}
                                                    className={styles.CalendarRoot}
                                                    wrapperClassname={styles.CalendarWrapper}
                                                    onChange={this.getOnChangeHistorical('beginDate')}
                                                >
                                                    {({ toggleCalendar }) => (
                                                        <button
                                                            type="button"
                                                            disabled={!canEdit}
                                                            onClick={toggleCalendar}
                                                            className={cx(styles.realTimeButton, {
                                                                [styles.StateSelectorActive]: !!settings.beginDate,
                                                            })}
                                                        >
                                                            {!settings.beginDate && ('From')}
                                                            {!!settings.beginDate && dateFormatter('DD/MM/YYYY')(settings.beginDate)}
                                                        </button>
                                                    )}
                                                </WithCalendar>
                                                <WithCalendar
                                                    date={!!settings.endDate && new Date(settings.endDate)}
                                                    className={styles.CalendarRoot}
                                                    wrapperClassname={styles.CalendarWrapper}
                                                    onChange={this.getOnChangeHistorical('endDate')}
                                                >
                                                    {({ toggleCalendar }) => (
                                                        <button
                                                            type="button"
                                                            disabled={!canEdit}
                                                            onClick={toggleCalendar}
                                                            className={cx(styles.realTimeButton, {
                                                                [styles.StateSelectorActive]: !!settings.endDate,
                                                            })}
                                                        >
                                                            {!settings.endDate && ('To')}
                                                            {!!settings.endDate && dateFormatter('DD/MM/YYYY')(settings.endDate)}
                                                        </button>
                                                    )}
                                                </WithCalendar>
                                            </div>
                                        ) : (
                                            <div className={styles.runTabValueToggle}>
                                                <div className={styles.saveStateToggleSection}>
                                                    {/* eslint-disable react/no-unknown-property */}
                                                    <R.Label
                                                        for="saveStateToggle"
                                                        className={styles.saveStateToggleLabel}
                                                    >
                                                        Save state
                                                    </R.Label>
                                                    {/* eslint-enable react/no-unknown-property */}
                                                    {/* eslint-disable max-len */}
                                                    <Toggle
                                                        id="saveStateToggle"
                                                        className={styles.saveStateToggle}
                                                        value={settings.serializationEnabled === 'true' /* yes, it's a string. legacy compatibility */}
                                                        onChange={(value) => setSaveState(value)}
                                                        disabled={!canEdit}
                                                    />
                                                    {/* eslint-enable max-len */}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.ModalButtons}>
                                    <Tooltip value={<React.Fragment>Keyboard<br />shortcuts</React.Fragment>}>
                                        <R.Button
                                            className={cx(styles.ToolbarButton, styles.KeyboardButton)}
                                        >
                                            <SvgIcon name="keyboard" />
                                        </R.Button>
                                    </Tooltip>
                                    <Tooltip value="Share">
                                        <R.Button
                                            className={cx(styles.ToolbarButton, styles.ShareButton)}
                                            onClick={() => shareDialog.open()}
                                        >
                                            <SvgIcon name="share" />
                                        </R.Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </ModalContainer>
                <ShareDialog canvas={canvas} />
            </div>
        )
    }
})
