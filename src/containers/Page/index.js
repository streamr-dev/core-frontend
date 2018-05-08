// @flow

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Page from '../../components/Page'
import type { StoreState } from '../../flowtype/store-state'
import { selectModalName } from '../../modules/modals/selectors'
import { hideModal } from '../../modules/modals/actions'

type StateProps = {
    modalOpen: boolean,
}

type DispatchProps = {
    hideModal: () => void,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    modalOpen: !!selectModalName(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    hideModal: () => dispatch(hideModal()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))
