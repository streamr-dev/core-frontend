import React from 'react'

import { KeyboardShortcutsSidebar, ComboList } from '$editor/shared/components/KeyboardShortcutsSidebar'

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
    {
        keys: [['meta', 'x']],
        title: 'Cut',
    },
    {
        keys: [['meta', 'c']],
        title: 'Copy',
    },
    {
        keys: [['meta', 'v']],
        title: 'Paste',
    },
    {
        keys: [['meta', '-']],
        title: 'Zoom Out',
    },
    {
        keys: [['meta', '+']],
        title: 'Zoom In',
    },
    {
        keys: [['meta', '0']],
        title: 'Full Size',
    },
    {
        keys: [['meta', '1']],
        title: 'Fit to Screen',
    },
    {
        keys: [['arrowleft']],
        title: 'Pan Left',
    },
    {
        keys: [['arrowright']],
        title: 'Pan Right',
    },
    {
        keys: [['arrowup']],
        title: 'Pan Up',
    },
    {
        keys: [['arrowdown']],
        title: 'Pan Down',
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

export default function CanvasKeyboardShortcutsSidebar(props) {
    return (
        <KeyboardShortcutsSidebar {...props}>
            <ComboList combos={generalCombos} label="General" initialIsOpen />
            <ComboList combos={moduleCombos} label="Regularly used modules" initialIsOpen />
        </KeyboardShortcutsSidebar>
    )
}
