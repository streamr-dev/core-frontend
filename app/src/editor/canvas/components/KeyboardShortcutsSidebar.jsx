import React from 'react'
import cx from 'classnames'

import { Header, Content, Section } from '$editor/shared/components/Sidebar'
import { isWindows } from '$shared/utils/platform'
import isEditableElement from '../utils/isEditableElement'

import styles from './keyboardShortcutsSidebar.pcss'

const generalCombos = [
    {
        keys: [['m'], ['+']],
        title: 'Modules panel',
        hidden: true,
    },
    {
        keys: [['delete']],
        title: 'Delete selected',
    },
    {
        keys: [['escape']],
        title: 'Drop selection',
    },
    {
        keys: [['tab']],
        title: 'Focus next input',
    },
    {
        keys: [['space']],
        title: 'Start / stop canvas',
        hidden: true,
    },
    {
        keys: [['s']],
        title: 'Speed control',
        hidden: true,
    },
    {
        keys: [['r']],
        title: 'Realtime mode',
        hidden: true,
    },
    {
        keys: [['h']],
        title: 'Historical mode',
        hidden: true,
    },
    {
        keys: [['o']],
        title: 'Open canvas',
        hidden: true,
    },
    {
        keys: [['.']],
        title: 'Canvas functions',
        hidden: true,
    },
    {
        keys: [['meta', 'z']],
        title: 'Undo',
    },
    {
        keys: [['meta', 'shift', 'z']],
        title: 'Redo',
    },
]

const moduleCombos = [
    {
        keys: [['1']],
        title: 'Add stream',
        hidden: true,
    },
    {
        keys: [['2']],
        title: 'Table',
        hidden: true,
    },
    {
        keys: [['3']],
        title: 'Chart',
        hidden: true,
    },
    {
        keys: [['4']],
        title: 'Map',
        hidden: true,
    },
    {
        keys: [['5']],
        title: 'Comment',
        hidden: true,
    },
]

const keyLabels = {
    escape: 'esc',
    meta: isWindows() ? 'WIN' : 'CMD',
}

const getKeyLabel = (key) => {
    if (keyLabels[key]) {
        return keyLabels[key]
    }

    return key.length === 1 ? key.toUpperCase() : key
}

const getEventKey = (event) => {
    const { key, code } = event
    let finalKey

    if (['Meta', 'Alt', 'Shift', 'Control', 'Delete'].includes(key)) {
        finalKey = key
    } else if (code === 'Space') {
        finalKey = code
    } else if (code.substring(0, 3) === 'Key') {
        finalKey = code.substring(3)
    } else {
        finalKey = key
    }

    return finalKey.toLowerCase()
}

class KeyboardShortcuts extends React.Component {
    initialState = {
        pressedKeys: {},
        // eslint-disable-next-line react/no-unused-state
        modifiedKeys: {
            meta: {},
            shift: {},
        },
    }

    state = {
        ...this.initialState,
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        window.addEventListener('blur', this.resetState)
        window.addEventListener('focus', this.resetState)
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
        window.removeEventListener('blur', this.resetState)
        window.removeEventListener('focus', this.resetState)
    }

    static shouldHandleKeyEvent(event) {
        return !isEditableElement(event.target || event.srcElement)
    }

    onKeyDown = (event) => {
        if (!KeyboardShortcuts.shouldHandleKeyEvent(event)) {
            this.resetState()
            return
        }

        // close on esc
        const { onClose } = this.props
        if (event.key === 'Escape' && typeof onClose === 'function') {
            onClose()
            return
        }

        this.setState(({ pressedKeys, modifiedKeys }) => {
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

            return {
                pressedKeys: {
                    ...pressedKeys,
                    [key]: true,
                },
                modifiedKeys: newModifiedKeys,
            }
        })
    }

    onKeyUp = (event) => {
        if (!KeyboardShortcuts.shouldHandleKeyEvent(event)) {
            this.resetState()
            return
        }

        this.setState(({ pressedKeys, modifiedKeys }) => {
            const key = getEventKey(event)
            let newPressedKeys
            let newModifiedKeys

            if (key === 'meta' || key === 'shift') {
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
    }

    resetState = () => {
        this.setState({
            ...this.initialState,
        })
    }

    renderComboList = (combos) => {
        const { pressedKeys } = this.state
        return (
            <div className={styles.keyList}>
                {combos.map(({ keys, title }) => {
                    const keyListId = keys.map((keySet) => keySet.join('')).join('')
                    return (
                        <React.Fragment key={keyListId}>
                            <div>
                                {keys.map((keySet) => {
                                    const keySetId = keySet.join('')
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
        )
    }

    render() {
        const { onClose } = this.props
        const visibleGeneralCombos = generalCombos.filter(({ hidden }) => !hidden)
        const visibleModuleCombos = moduleCombos.filter(({ hidden }) => !hidden)
        return (
            <React.Fragment>
                <Header
                    title="Keyboard Shortcuts"
                    onClose={onClose}
                />
                <Content>
                    {!!visibleGeneralCombos.length && (
                        <Section label="General" initialIsOpen>
                            {this.renderComboList(visibleGeneralCombos)}
                        </Section>
                    )}
                    {!!visibleModuleCombos.length && (
                        <Section label="Regularly used modules" initialIsOpen>
                            {this.renderComboList(visibleModuleCombos)}
                        </Section>
                    )}
                </Content>
            </React.Fragment>
        )
    }
}

export default KeyboardShortcuts
