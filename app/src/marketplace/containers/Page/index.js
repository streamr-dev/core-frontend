// @flow

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import withI18n from '../WithI18n'
import Page from '../../components/Page'
import type { StoreState } from '../../flowtype/store-state'
import { selectIsModalOpen } from '../../modules/modals/selectors'
import { hideModal } from '../../modules/modals/actions'

type StateProps = {
    modalOpen: boolean,
}

type DispatchProps = {
    hideModal: () => void,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    modalOpen: selectIsModalOpen(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    hideModal: () => dispatch(hideModal()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withI18n(Page)))
