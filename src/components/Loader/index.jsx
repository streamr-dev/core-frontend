import React from 'react'
import { connect } from 'react-redux'
import { getCurrentUser } from '../../modules/user/actions'
import { getResourceKeys } from '../../modules/key/actions'

export default connect(null, (dispatch) => ({
    load() {
        dispatch(getCurrentUser())
        dispatch(getResourceKeys('USER', 'me'))
    },
}))(class Loader extends React.Component {
    componentDidMount() {
        this.props.load()
    }

    render() {
        return null
    }
})
