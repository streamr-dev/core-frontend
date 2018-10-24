// @flow

// import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import StreamLiveDataDialog from '../../../components/Modal/StreamLiveDataDialog'
import type { StoreState } from '../../../flowtype/store-state'
import type { StreamList } from '$shared/flowtype/stream-types'
import { selectProduct, selectStreams as selectProductStreams } from '../../../modules/product/selectors'
import type { ApiKey, User } from '$shared/flowtype/user-types'
import { selectApiKey, selectUserData } from '../../../modules/user/selectors'
import { getApiKeys } from '../../../modules/user/actions'
import { formatPath } from '$shared/utils/url'

type StateProps = {
    streams: StreamList,
    currentUser: ?User,
    apiKey: ?ApiKey,
}

type DispatchProps = {
    getApiKeys: () => void,
    hideStreamLiveDataDialog: (...params: any) => void,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectProductStreams(state),
    currentUser: selectUserData(state),
    apiKey: selectApiKey(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getApiKeys: () => dispatch(getApiKeys()),
    hideStreamLiveDataDialog: (...params) => dispatch(replace(formatPath(...params))),
})

export default connect(mapStateToProps, mapDispatchToProps)(StreamLiveDataDialog)
