// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'
import type { StoreState } from '../../../flowtype/store-state'

// import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'

import ReadyToPublishDialog from '../../../components/Modal/ReadyToPublishDialog'
import { formatPath } from '../../../utils/url'
import { publishFreeProduct } from '../../../modules/product/actions'
import { selectPublishingFreeProduct } from '../../../modules/product/selectors'
import links from '../../../links'

type StateProps = {
    publishing: boolean,
    isFreeProduct: boolean,
}

type DispatchProps = {
    onPublish: () => void,
    onCancel: () => void,
}

export type OwnProps = {
    match: Match,
}

type Props = StateProps & DispatchProps & OwnProps

class PublishDialog extends React.Component<Props> {
    componentDidMount() {
        console.log(this.props.match.params.id)
    }

    render() {
        const { isFreeProduct, publishing, onPublish, onCancel } = this.props

        if (isFreeProduct) {
            return <ReadyToPublishDialog waiting={publishing} onPublish={onPublish} onCancel={onCancel} />
        }

        return <ReadyToPublishDialog onPublish={onPublish} onCancel={onCancel} />
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    publishing: selectPublishingFreeProduct(state),
    isFreeProduct: true,
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onPublish: () => dispatch(publishFreeProduct(ownProps.match.params.id)),
    onCancel: () => dispatch(push(formatPath(links.products, ownProps.match.params.id))),
})

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog)
