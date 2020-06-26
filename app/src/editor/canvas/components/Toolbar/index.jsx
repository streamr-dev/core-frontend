/* eslint-disable react/no-unused-state */
import React from 'react'
import * as R from 'reactstrap'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'

import Meatball from '$shared/components/Meatball'
import Toggle from '$shared/components/Toggle'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'
import SvgIcon from '$shared/components/SvgIcon'
import StatusIcon from '$shared/components/StatusIcon'
import Popover from '$shared/components/Popover'
import Tooltip from '$shared/components/Tooltip'
import WithCalendar from '$shared/components/WithCalendar'
import dateFormatter from '$utils/dateFormatter'
import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import confirmDialog from '$shared/utils/confirm'

import Toolbar from '$editor/shared/components/Toolbar'
import useCanvasCamera from '../../hooks/useCanvasCamera'
import { RunTabs } from '../../state'
import { getCanvasMessages, getMaxLevel } from '../../state/messages'

import CanvasSearch from '../CanvasSearch'
import * as RunController from '../CanvasController/Run'
import { useCameraContext } from '../Camera'
import { MessageIconSimple } from '../ConsoleSidebar'
import styles from './Toolbar.pcss'
import ToolbarLayout from './ToolbarLayout'

function ZoomControls({ className, canvas }) {
    const camera = useCameraContext()
    const canvasCamera = useCanvasCamera({ canvas })
    return (
        <div className={cx(className, styles.ZoomControls)}>
            <Popover
                className={cx(styles.ZoomMenu, styles.DropdownMenu)}
                noCaret
                menuProps={{
                    className: styles.DropdownMenuMenu,
                }}
                title={
                    <div className={styles.ZoomButtons}>
                        <button
                            className={cx(styles.ToolbarButton, styles.ZoomButton)}
                            type="button"
                            onClick={(event) => { event.stopPropagation(); camera.zoomOut() }}
                        >
                            <SvgIcon name="minusSmall" className={styles.icon} />
                        </button>
                        <button className={cx(styles.ZoomMenuTrigger)} type="button">
                            {Math.round(camera.scale * 100)}%
                        </button>
                        <button
                            className={cx(styles.ToolbarButton, styles.ZoomButton)}
                            type="button"
                            onClick={(event) => { event.stopPropagation(); camera.zoomIn() }}
                        >
                            <SvgIcon name="plusSmall" className={styles.icon} />
                        </button>
                    </div>
                }
            >
                <Popover.Item onClick={() => camera.setScale(1)}>
                    Full size
                </Popover.Item>
                <Popover.Item onClick={() => canvasCamera.fitCanvas()}>
                    Fit screen
                </Popover.Item>
                <Popover.Item onClick={() => camera.zoomIn()}>
                    Zoom In
                </Popover.Item>
                <Popover.Item onClick={() => camera.zoomOut()}>
                    Zoom Out
                </Popover.Item>
                <Popover.Item divider />
                <Popover.Item onClick={() => camera.setScale(0.5)}>50%</Popover.Item>
                <Popover.Item onClick={() => camera.setScale(1)}>100%</Popover.Item>
                <Popover.Item onClick={() => camera.setScale(2)}>200%</Popover.Item>
            </Popover>
        </div>
    )
}

export default withErrorBoundary(ErrorComponentView)(class CanvasToolbar extends React.PureComponent {
    static contextType = RunController.Context

    state = {
        canvasSearchIsOpen: false,
        runButtonDropdownOpen: false,
    }

    canvasSearchOpen = (show = true) => {
        this.setState({
            canvasSearchIsOpen: !!show,
        })
    }

    getOnChangeHistorical = (key) => (value) => {
        this.props.setHistorical({
            [key]: value,
        })
    }

    onToggleRunButtonMenu = () => {
        this.setState(({ runButtonDropdownOpen }) => ({
            runButtonDropdownOpen: !runButtonDropdownOpen,
        }))
    }

    onDeleteCanvas = async () => {
        const confirmed = await confirmDialog('canvas', {
            title: I18n.t('userpages.canvases.delete.confirmTitle'),
            message: I18n.t('userpages.canvases.delete.confirmMessage'),
            acceptButton: {
                title: I18n.t('userpages.canvases.delete.confirmButton'),
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            this.props.deleteCanvas()
        }
    }

    elRef = React.createRef()

    render() {
        const {
            canvas,
            className,
            duplicateCanvas,
            setSaveState,
            setRunTab,
            renameCanvas,
            canvasStart,
            canvasStop,
            canvasExit,
            newCanvas,
            setSpeed,
            moduleSearchIsOpen,
            sidebar,
        } = this.props

        if (!canvas) {
            return (
                <div className={cx(className, styles.CanvasToolbar)} />
            )
        }

        const runController = this.context
        const { runButtonDropdownOpen, canvasSearchIsOpen } = this.state
        const {
            isRunning,
            isActive,
            hasWritePermission,
            hasDeletePermission,
            canChangeRunState,
        } = runController
        const canEdit = runController.isEditable
        const canShare = runController.hasSharePermission
        const { settings = {} } = canvas
        const { editorState = {} } = settings
        const badgeLevel = getMaxLevel(getCanvasMessages(canvas))
        return (
            <div
                ref={this.elRef}
                className={cx(className, styles.CanvasToolbar, {
                    [styles.notEditable]: !hasWritePermission,
                })}
            >
                <ToolbarLayout>
                    <div className={ToolbarLayout.classNames.LEFT}>
                        <UseState initialValue={false}>
                            {(editing, setEditing) => (
                                <div className={styles.CanvasNameContainer}>
                                    <StatusIcon status={isRunning ? StatusIcon.OK : StatusIcon.INACTIVE} className={styles.status} />
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
                                    {/* !canEdit && (
                                        <span className={styles.ownerName}>by TODO: get owner name</span>
                                    ) */}
                                    <Popover
                                        title={
                                            <R.Button className={cx(styles.MeatballContainer, styles.ToolbarButton)}>
                                                <Meatball alt="Select" />
                                            </R.Button>
                                        }
                                        noCaret
                                        disabled={!canEdit}
                                        className={styles.DropdownMenu}
                                        menuProps={{
                                            className: styles.DropdownMenuMenu,
                                        }}
                                    >
                                        <Popover.Item onClick={newCanvas}>New Canvas</Popover.Item>
                                        <Popover.Item
                                            onClick={() => sidebar.open('share')}
                                            disabled={!canShare}
                                        >
                                            Share
                                        </Popover.Item>
                                        <Popover.Item
                                            onClick={() => setEditing(true)}
                                            disabled={!canEdit}
                                        >
                                            Rename
                                        </Popover.Item>
                                        <Popover.Item onClick={() => duplicateCanvas()}>Duplicate</Popover.Item>
                                        <Popover.Item
                                            onClick={this.onDeleteCanvas}
                                            disabled={!hasDeletePermission}
                                        >
                                            Delete
                                        </Popover.Item>
                                    </Popover>
                                </div>
                            )}
                        </UseState>
                        <div className={styles.OpenAddButtons}>
                            <R.Button
                                className={cx(styles.ToolbarButton, styles.OpenCanvasButton)}
                                onMouseDown={(event) => {
                                    // required to prevent mouseDown causing open search panel to blur
                                    // which closes the search panel, only to be opened again on mouseup (click)
                                    // also somehow strangely affected by realtime/historical button ? nfi.
                                    event.preventDefault()
                                }}
                                onClick={() => {
                                    this.canvasSearchOpen(!this.state.canvasSearchIsOpen)
                                }}
                            >
                                Open
                            </R.Button>
                            <CanvasSearch
                                className={styles.CanvasSearch}
                                canvas={canvas}
                                isOpen={canvasSearchIsOpen}
                                open={this.canvasSearchOpen}
                            />
                            <Tooltip
                                container={this.elRef.current}
                                value={moduleSearchIsOpen ? (
                                    'Hide module panel'
                                ) : (
                                    'Show module panel'
                                )}
                            >
                                <R.Button
                                    className={cx(styles.ToolbarButton, styles.AddButton, {
                                        [styles.active]: !!moduleSearchIsOpen,
                                    })}
                                    onClick={() => this.props.moduleSearchOpen(!moduleSearchIsOpen)}
                                    disabled={!canEdit}
                                >
                                    <SvgIcon name="plus" className={styles.icon} />
                                </R.Button>
                            </Tooltip>
                        </div>
                        <ZoomControls className={styles.ToolbarZoomControls} canvas={canvas} />
                        <div />
                    </div>
                    <div className={ToolbarLayout.classNames.CENTER}>
                        <div>
                            <R.ButtonGroup
                                className={cx(styles.RunButtonGroup, {
                                    [styles.RunButtonStopped]: !(isActive || canvas.adhoc),
                                    [styles.RunButtonRunning]: isActive || canvas.adhoc,
                                })}
                            >
                                <R.Button
                                    disabled={!canChangeRunState}
                                    onClick={() => {
                                        if (isRunning) {
                                            return canvasStop()
                                        }
                                        if (canvas.adhoc) {
                                            return canvasExit()
                                        }
                                        return canvasStart()
                                    }}
                                    className={styles.RunButton}
                                >
                                    {((() => {
                                        if (isActive) { return 'Stop' }
                                        if (canvas.adhoc && !isActive) { return 'Clear' }
                                        if (editorState.runTab === RunTabs.realtime) { return 'Start' }
                                        return 'Run'
                                    })())}
                                </R.Button>
                                {editorState.runTab === RunTabs.historical ? (
                                    <R.ButtonDropdown
                                        isOpen={runButtonDropdownOpen}
                                        toggle={this.onToggleRunButtonMenu}
                                        className={styles.RunDropdownButton}
                                    >
                                        <R.DropdownToggle disabled={!canChangeRunState} caret>
                                            {!runButtonDropdownOpen && (
                                                <SvgIcon name="caretUp" />
                                            )}
                                            {runButtonDropdownOpen && (
                                                <SvgIcon name="caretDown" />
                                            )}
                                        </R.DropdownToggle>
                                        <R.DropdownMenu
                                            className={cx(styles.RunButtonMenu, styles.HistoricalRunButtonMenu)}
                                            disabled={!canChangeRunState}
                                            right
                                        >
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
                                                disabled={!canEdit}
                                            >
                                                Reset &amp; Start
                                            </R.DropdownItem>
                                        </R.DropdownMenu>
                                    </R.ButtonDropdown>
                                )}
                            </R.ButtonGroup>
                        </div>
                    </div>
                    <div className={ToolbarLayout.classNames.RIGHT}>
                        <div />
                        <div className={styles.StateSelectorContainer}>
                            <div className={styles.StateSelector}>
                                <div className={styles.runTabToggle}>
                                    <button
                                        type="button"
                                        onClick={() => setRunTab(RunTabs.realtime)}
                                        disabled={!canEdit}
                                        className={cx(styles.ToolbarSolidButton, styles.firstButton, {
                                            [styles.StateSelectorActive]: editorState.runTab !== RunTabs.historical,
                                        })}
                                    >
                                        Realtime
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRunTab(RunTabs.historical)}
                                        disabled={!canEdit}
                                        className={cx(styles.ToolbarSolidButton, styles.lastButton, {
                                            [styles.StateSelectorActive]: editorState.runTab === RunTabs.historical,
                                        })}
                                    >
                                        Historical
                                    </button>
                                </div>
                                {editorState.runTab === RunTabs.historical ? (
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
                                                    className={cx(styles.ToolbarSolidButton, styles.firstButton, {
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
                                                    className={cx(styles.ToolbarSolidButton, styles.lastButton, {
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
                                                className={cx(styles.saveStateToggleLabel, {
                                                    [styles.StateSelectorActive]: settings.serializationEnabled === 'true',
                                                })}

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
                            <Tooltip container={this.elRef.current} value="Console">
                                <R.Button
                                    className={cx(styles.ToolbarButton, styles.ConsoleButton)}
                                    onClick={() => sidebar.open('console')}
                                >
                                    {(badgeLevel && badgeLevel !== 'none') && (
                                        <MessageIconSimple level={badgeLevel} className={styles.consoleButtonBadge} />
                                    )}
                                    <SvgIcon name="console" />
                                </R.Button>
                            </Tooltip>
                            <Tooltip container={this.elRef.current} value="Share">
                                <R.Button
                                    className={cx(styles.ToolbarButton, styles.ShareButton)}
                                    onClick={() => sidebar.open('share')}
                                    disabled={!canShare}
                                >
                                    <SvgIcon name="share" />
                                </R.Button>
                            </Tooltip>
                            <Tooltip container={this.elRef.current} value={<React.Fragment>Keyboard<br />shortcuts</React.Fragment>}>
                                <R.Button
                                    className={cx(styles.ToolbarButton, styles.KeyboardButton)}
                                    onClick={() => sidebar.open('keyboardShortcuts')}
                                >
                                    <SvgIcon name="keyboard" />
                                </R.Button>
                            </Tooltip>
                        </div>
                    </div>
                </ToolbarLayout>
            </div>
        )
    }
})
