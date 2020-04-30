import React, { useEffect, useRef } from 'react'
import cx from 'classnames'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import scrollTo from '$shared/utils/scrollTo'

import SvgIcon from '$shared/components/SvgIcon'
import { Header, Content } from '$editor/shared/components/Sidebar'
import { Translate } from 'react-redux-i18n'
import * as CanvasState from '../state'
import * as CanvasMessages from '../state/messages'
import styles from './ConsoleSidebar.pcss'

const Icons = {
    error: 'errorBadge',
    warn: 'warnBadge',
    info: 'infoBadge',
}

export function MessageIcon({ level, ...props }) {
    return (
        <div {...props}>
            <SvgIcon name={Icons[level]} />
        </div>
    )
}

export function MessageIconSimple({ level, className, ...props }) {
    return (
        <div
            {...props}
            className={cx(className, styles.MessageSimpleIcon, styles[level])}
        />
    )
}

function MessageRow({ msg }) {
    return (
        <div className={cx(styles.MessageRow, styles[msg.level])}>
            <MessageIcon level={msg.level} className={styles.messageIcon} />
            <div className={styles.messageRhs}>
                <div className={styles.messageTitle}>
                    {!msg.translate ? msg.title : (
                        <Translate value={msg.title} {...msg.details} dangerousHTML />
                    )}
                </div>
                <div className={styles.messageContent}>
                    {!msg.translate ? msg.content : (
                        <Translate value={msg.content} {...msg.details} dangerousHTML />
                    )}
                </div>
            </div>
        </div>
    )
}

function MessageGroup({
    canvas,
    messages,
    moduleHash,
    selectedModuleHash,
    selectModule,
}) {
    const isSelected = selectedModuleHash === moduleHash
    const elRef = useRef()
    useEffect(() => {
        // scroll into view if selected
        if (isSelected) {
            scrollTo(elRef.current, true)
        }
    }, [isSelected])

    return (
        /* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
        <div
            className={cx(styles.messageGroup, {
                [styles.selectedGroup]: isSelected,
            })}
            onClick={() => selectModule({ hash: moduleHash })}
            ref={elRef}
        >
            <div className={styles.messageGroupTitle}>
                {CanvasState.getDisplayName(CanvasState.getModule(canvas, moduleHash))}
            </div>
            {sortBy(messages, (level) => CanvasMessages.LEVELS.indexOf(level)).reverse().map((msg, index) => (
                /* eslint-disable-next-line react/no-array-index-key */
                <MessageRow key={index} msg={msg} />
            ))}
        </div>
    )
}

function ConsoleMessages({ canvas, messages, selectedModuleHash, selectModule }) {
    const groupedMessages = groupBy(messages, 'moduleHash')
    const maxMessageLevel = (msgs) => Math.max(...msgs.map(({ level }) => CanvasMessages.LEVELS.indexOf(level)))
    const sortedMessageEntries = sortBy(Object.entries(groupedMessages), ([, msgs]) => maxMessageLevel(msgs)).reverse()

    return (
        <div className={styles.ConsoleMessages}>
            <div className={styles.messageList}>
                {sortedMessageEntries.map(([moduleHash, msgs]) => (
                    <MessageGroup
                        key={moduleHash}
                        moduleHash={Number(moduleHash)}
                        canvas={canvas}
                        messages={msgs}
                        selectedModuleHash={selectedModuleHash}
                        selectModule={selectModule}
                    />
                ))}
            </div>
        </div>
    )
}

export default function ConsoleSidebar({ canvas, selectedModuleHash, selectModule, onClose }) {
    const canvasMessages = CanvasMessages.getCanvasMessages(canvas)

    return (
        <React.Fragment>
            <Header title="Console" onClose={onClose} />
            <Content className={styles.content}>
                <ConsoleMessages
                    canvas={canvas}
                    messages={canvasMessages}
                    selectedModuleHash={selectedModuleHash}
                    selectModule={selectModule}
                />
            </Content>
        </React.Fragment>
    )
}
