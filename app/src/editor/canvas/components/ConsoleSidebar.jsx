import React from 'react'
import cx from 'classnames'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'

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

function ConsoleMessages({ canvas, messages, selectedModuleHash, selectModule }) {
    const groupedMessages = groupBy(messages, 'moduleHash')
    const maxMessageLevel = (msgs) => Math.max(...msgs.map(({ level }) => CanvasMessages.LEVELS.indexOf(level)))
    const sortedMessageEntries = sortBy(Object.entries(groupedMessages), ([, msgs]) => maxMessageLevel(msgs)).reverse()

    return (
        <div className={styles.ConsoleMessages}>
            <div className={styles.messageList}>
                {sortedMessageEntries.map(([moduleHash, msgs]) => {
                    moduleHash = Number(moduleHash)
                    return (
                        /* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
                        <div
                            key={moduleHash}
                            className={cx(styles.messageGroup, {
                                [styles.selectedGroup]: selectedModuleHash === moduleHash,
                            })}
                            onClick={() => selectModule({ hash: moduleHash })}
                        >
                            <div className={styles.messageGroupTitle}>
                                {CanvasState.getDisplayName(CanvasState.getModule(canvas, moduleHash))}
                            </div>
                            {sortBy(msgs, (level) => CanvasMessages.LEVELS.indexOf(level)).reverse().map((msg, index) => (
                                /* eslint-disable-next-line react/no-array-index-key */
                                <MessageRow key={index} msg={msg} />
                            ))}
                        </div>
                    )
                })}
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
