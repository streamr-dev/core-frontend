// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'

// import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'

import ReadyToPublishDialog from '../../../components/Modal/ReadyToPublishDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'

type StateProps = {
}

type DispatchProps = {
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
        const { onCancel } = this.props

        return <ReadyToPublishDialog onCancel={onCancel} />
    }
}

const mapStateToProps = (): StateProps => ({})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onCancel: () => dispatch(push(formatPath(links.products, ownProps.match.params.id))),
})

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog)
