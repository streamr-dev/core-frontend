// @flow

// FIXME(Mariusz): Fix styling for this module. It's completely broken atm.

import React from 'react'
import { Translate } from 'react-redux-i18n'

import styles from './moduleError.pcss'

type Layout = {
    height: number,
    position: {
        left: number,
        top: number,
    },
    width: number,
}

type Props = {
    module: {
        displayName: string,
        layout: Layout,
        name: string,
    }
}

const style = ({ height: minHeight, position: { left, top }, width: minWidth }: Layout): Object => ({
    left,
    minHeight,
    minWidth,
    top,
})

const ModuleError = ({ module: { layout, displayName, name } }: Props) => (
    <div
        className={styles.root}
        style={style(layout)}
    >
        <div>
            {displayName || name}
        </div>
        <div>
            <Translate value="error.general" />
        </div>
    </div>
)

export default ModuleError
