// @flow

import { connect } from 'react-redux'
import LoginPage from '../../components/LoginPage'
import { doLogin } from '../../modules/user/actions'
import { selectFetchingToken } from '../../modules/user/selectors'
import type { StoreState } from '../../flowtype/store-state'

type StateProps = {
    fetching: boolean,
}

type DispatchProps = {
    doLogin: () => void,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    fetching: selectFetchingToken(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    doLogin: () => dispatch(doLogin()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
