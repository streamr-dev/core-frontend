// @flow

import { connect } from 'react-redux'
import { getLocation } from 'react-router-redux'
import { type Location } from 'react-router-dom'

import PageTurner from '../../components/PageTurner'

import type { StoreState } from '$shared/flowtype/store-state'

export type StateProps = {
    location: Location,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    location: getLocation(state),
})

export default connect(mapStateToProps)(PageTurner)
