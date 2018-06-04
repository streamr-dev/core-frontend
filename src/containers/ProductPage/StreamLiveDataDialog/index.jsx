// @flow

// import React from 'react'
import { connect } from 'react-redux'
import StreamLiveDataDialog from '../../../components/Modal/StreamLiveDataDialog'
import type { StoreState } from '../../../flowtype/store-state'
import type { StreamList } from '../../../flowtype/stream-types'
import { selectProduct, selectStreams as selectProductStreams } from '../../../modules/product/selectors'
import type { ApiKey, User } from '../../../flowtype/user-types'
import { selectApiKey, selectUserData } from '../../../modules/user/selectors'
import { getApiKeys } from '../../../modules/user/actions'

type StateProps = {
    streams: StreamList,
    currentUser: ?User,
    apiKey: ?ApiKey,
}

type DispatchProps = {
    getApiKeys: () => void,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectProductStreams(state),
    currentUser: selectUserData(state),
    apiKey: selectApiKey(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getApiKeys: () => dispatch(getApiKeys()),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamLiveDataDialog)
