import React from 'react'

import { KeyboardShortcutsSidebar, ComboList } from '$editor/shared/components/KeyboardShortcutsSidebar'

const generalCombos = [
    {
        keys: [['delete']],
        title: 'Delete selected',
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

export default function DashboardKeyboardShortcutsSidebar(props) {
    return (
        <KeyboardShortcutsSidebar {...props}>
            <ComboList combos={generalCombos} label="General" isOpen />
        </KeyboardShortcutsSidebar>
    )
}
