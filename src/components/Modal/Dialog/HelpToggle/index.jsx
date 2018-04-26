// @flow

import React from 'react'

export type Props = {
    active: boolean,
    onToggle: () => void,
}

export const HelpToggle = ({ active, onToggle }: Props) => (
    <button onClick={onToggle}>{!active ? '?' : 'x'}</button>
)

export default HelpToggle
