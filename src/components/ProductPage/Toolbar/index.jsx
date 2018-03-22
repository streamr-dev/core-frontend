// @flow

import React from 'react'
import { connect } from 'react-redux'
import Panel from '../../Panel'
import { Button } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
import styles from './toolbar.pcss'
import { updatePublishState } from '../../../modules/product/actions' 

type Props = {
    productId: string,
    published: boolean,
    updatePublishState: () => void,
}

const Toolbar = ({ productId, published }: Props) => {
    const publishedState = published ? 'Unpublish' : 'Publish'

    return (
        <Panel>
            <div className={styles.left}>
                <Link to={formatPath(links.products, productId)+'/edit'}>
                    <Button color="secondary">Edit</Button>
                </Link>
            </div>
            <div className={styles.right}>
                <Button color="primary">{publishedState}</Button>
            </div>
        </Panel>
    )
}

const mapDispatchToProps = (dispatch: Function) => ({
    updatePublishState: () => dispatch(updatePublishState()),
})

export default connect(null, mapDispatchToProps)(Toolbar)

