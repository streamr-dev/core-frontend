import React, { useEffect, useCallback, useState } from 'react'
import cx from 'classnames'

import { isWindows as getIsWindows, isMac as getIsMac } from '$shared/utils/platform'
import { Header, Content, Section } from '$editor/shared/components/Sidebar'
import isEditableElement from '$editor/shared/utils/isEditableElement'

import styles from './KeyboardShortcutsSidebar.pcss'

const isWindows = getIsWindows()
const isMac = getIsMac()

const keyLabels = {
    escape: 'esc',
    meta: isWindows ? 'win' : '⌘',
    control: 'ctrl',
    alt: isMac ? 'opt' : 'alt',
    shift: 'shift',
}

function getPlatformKey(key) {
    // transform 'meta' shortcuts to use the 'control' key on windows
    if (key === 'meta' && isWindows) { return 'control' }
    return key
}

export const getKeyLabel = (key) => {
    key = getPlatformKey(key)
    if (keyLabels[key]) {
        return keyLabels[key]
    }

    return key.length === 1 ? key.toUpperCase() : key
}

const AS_IS = new Set(['Meta', 'Alt', 'Shift', 'Control', 'Delete'])
const getEventKey = (event) => {
    const { key, code } = event
    let finalKey

    if (AS_IS.has(key)) {
        finalKey = key
    } else if (code === 'Space') {
        finalKey = code
    } else if (code.startsWith('Key')) {
        finalKey = code.slice('Key'.length)
    } else if (code.startsWith('Digit')) {
        finalKey = code.slice('Digit'.length)
    } else {
        finalKey = code
    }

    return finalKey.toLowerCase()
}

function shouldHandleKeyEvent(event) {
    return !isEditableElement(event.target || event.srcElement)
}

const INITIAL_PRESSED_KEYS_STATE = {
    pressedKeys: {},
    // eslint-disable-next-line react/no-unused-state
    modifiedKeys: {
        meta: {},
        shift: {},
        control: {},
    },
}

function usePressedKeys(initialState = INITIAL_PRESSED_KEYS_STATE) {
    const [state, setState] = useState(initialState)

    const resetState = useCallback(() => {
        setState(initialState)
    }, [setState, initialState])
    const isInitialState = state === initialState

    const onKeyDown = useCallback((event) => {
        if (!shouldHandleKeyEvent(event)) {
            if (!isInitialState) {
                resetState()
            }
            return
        }

        setState(({ pressedKeys, modifiedKeys }) => {
            const key = getEventKey(event)
            const newModifiedKeys = {
                ...modifiedKeys,
            }

            // Metakey needs special handling because the actual character
            // does not fire a keyup event if modified by the meta key
            if (event.metaKey) {
                newModifiedKeys.meta[key] = true
            }

            // Holding shift might result in receiving different character on keyup
            // (for example first holding '+' and then holding 'shift' and releasing '+' ends up as '?')
            if (event.shiftKey) {
                newModifiedKeys.shift[key] = true
            }

            if (event.ctrlKey) {
                newModifiedKeys.control[key] = true
            }

            return {
                pressedKeys: {
                    ...pressedKeys,
                    [key]: true,
                },
                modifiedKeys: newModifiedKeys,
            }
        })
    }, [setState, isInitialState, resetState])

    const onKeyUp = useCallback((event) => {
        if (!shouldHandleKeyEvent(event)) {
            if (!isInitialState) {
                resetState()
            }
            resetState()
            return
        }

        setState(({ pressedKeys, modifiedKeys }) => {
            const key = getEventKey(event)
            let newPressedKeys
            let newModifiedKeys

            if (key === 'meta' || key === 'shift' || key === 'control') {
                // Clear up all the keys received while holding the meta or shift key
                newPressedKeys = Object.keys(pressedKeys).reduce((result, k) => ({
                    ...result,
                    [key]: modifiedKeys[key][k] ? false : pressedKeys[k],
                }), {})
                newModifiedKeys = {
                    ...modifiedKeys,
                    [key]: {},
                }
            } else {
                newPressedKeys = {
                    ...pressedKeys,
                }
                newModifiedKeys = {
                    ...modifiedKeys,
                }
            }

            return {
                pressedKeys: {
                    ...newPressedKeys,
                    [key]: false,
                },
                modifiedKeys: newModifiedKeys,
            }
        })
    }, [resetState, isInitialState, setState])

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown, true)
        window.addEventListener('keyup', onKeyUp, true)
        window.addEventListener('blur', resetState, true)
        window.addEventListener('focus', resetState, true)
        return () => {
            window.removeEventListener('keydown', onKeyDown, true)
            window.removeEventListener('keyup', onKeyUp, true)
            window.removeEventListener('blur', resetState, true)
            window.removeEventListener('focus', resetState, true)
        }
    }, [onKeyDown, onKeyUp, resetState])
    return state
}

export function KeyboardShortcutsSidebar({ onClose, children }) {
    return (
        <React.Fragment>
            <Header
                title="Keyboard Shortcuts"
                onClose={onClose}
            />
            <Content>
                {children}
            </Content>
        </React.Fragment>
    )
}

export function ComboList({ combos, ...props }) {
    const { pressedKeys } = usePressedKeys()
    const visibleCombos = combos.filter(({ hidden }) => !hidden)
    if (!visibleCombos.length) { return null }
    return (
        <Section {...props}>
            <div className={styles.keyList}>
                {visibleCombos.map(({ keys, title }) => {
                    keys = keys.map((keySet) => keySet.map((key) => getPlatformKey(key)))
                    const keyListId = keys.map((keySet) => keySet.join(',')).join('')
                    return (
                        <React.Fragment key={keyListId}>
                            <div>
                                {keys.map((keySet) => {
                                    const keySetId = keySet.join(',')
                                    return keySet.map((key) => (
                                        <span
                                            key={`${keyListId}-${keySetId}-${key}`}
                                            className={cx(styles.keyCode, {
                                                [styles.keyCodePressed]: !!pressedKeys[key],
                                                [styles.allCodesPressed]: (!!pressedKeys[key] && (
                                                    keySet.length === 1 ||
                                                    keySet.every((k) => !!pressedKeys[k])
                                                )),
                                            })}
                                        >
                                            {getKeyLabel(key)}
                                        </span>
                                    )).reduce((prev, curr) => [prev, ' + ', curr])
                                }).reduce((prev, curr) => [prev, ' or ', curr])}
                            </div>
                            <div>
                                {title}
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </Section>
    )
}
