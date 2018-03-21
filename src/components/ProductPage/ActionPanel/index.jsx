// @flow

import React from 'react'
import Panel from '../../Panel'
import { Button } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'
import styles from './actionPanel.pcss'
export type Props = {
//Product publish state
//Action to update the published state
}

const ActionPanel = () => (
    <Panel>
        <div className={styles.left}>
            <Link to="/edit">
                <Button color="secondary">Edit</Button>
            </Link>
        </div>
        <div className={styles.right}>
            <Button color="primary">Publish</Button>
        </div>
    </Panel>
)

export default ActionPanel
