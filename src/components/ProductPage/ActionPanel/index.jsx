// @flow

import React from 'react'
import Panel from '../../Panel'
import { Button } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
import styles from './actionPanel.pcss'
export type Props = {
    productId: string,
    published: boolean
    // Action to update the published state
}

const ActionPanel = ({ productId, published }: Props) => {
    return (
        <Panel>
            <div className={styles.left}>
                <Link to={formatPath(links.products, productId)+'/edit'}>
                    <Button color="secondary">Edit</Button>
                </Link>
            </div>
            <div className={styles.right}>
                <Button color="primary">Publish</Button>
            </div>
        </Panel>
    )
}

export default ActionPanel
