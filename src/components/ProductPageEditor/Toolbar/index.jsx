// @flow

import React from 'react'
import Panel from '../../Panel'
import { Button } from '@streamr/streamr-layout'
import styles from './toolbar.pcss'
export type Props = {
    productId?: string,
    published: boolean
    // Action to update the published state
}

const Toolbar = ({ published }: Props) => {
    const publishedState = published ? 'Unpublish' : 'Publish'

    return (
        <Panel>
            <div className={styles.right}>
                <Button color="secondary" >Save</Button>
                <Button color="primary" >{publishedState}</Button>
            </div>
        </Panel>
    )
}

export default Toolbar
