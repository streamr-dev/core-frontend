// @flow

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'react-router-redux'

import Footer from '../../components/Footer'

export type DispatchProps = {
    pushLocation: (string) => void,
}

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    pushLocation: (location: string) => (
        dispatch(push(location))
    ),
})

export default connect(null, mapDispatchToProps)(withRouter(Footer))
