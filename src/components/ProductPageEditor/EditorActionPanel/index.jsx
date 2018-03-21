// @flow

import React from 'react'
import Panel from '../../Panel'
import { Button } from '@streamr/streamr-layout'
import styles from './EditorActionPanel.pcss'
export type Props = {
    productId?: string,
    published: boolean
    // Action to update the published state
}

const EditorActionPanel = ({ published }: Props) => {
    return (
        <Panel>
            <div className={styles.right}>
                <Button color="secondary" >Save</Button>
                <Button color="primary" >Publish</Button>
            </div>
        </Panel>
    )
}

export default EditorActionPanel
