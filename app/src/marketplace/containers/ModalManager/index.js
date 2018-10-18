// @flow

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import type { StoreState } from '../../flowtype/store-state'
import { selectIsModalOpen } from '../../modules/modals/selectors'
import { hideModal as hideModalAction } from '../../modules/modals/actions'

type StateProps = {
    modalOpen: boolean,
}

type DispatchProps = {
    hideModal: () => void,
}

type Props = DispatchProps & StateProps & {
    location: {
        pathname: string,
    },
}

class ModalManager extends React.Component<Props> {
    componentDidUpdate({ location: { pathname: prevPathname } }: Props) {
        if (this.props.location.pathname !== prevPathname) {
            this.onRouteChanged()
        }
    }

    onRouteChanged = () => {
        const { modalOpen, hideModal } = this.props
        const topOfPage = document.getElementById('root')

        if (topOfPage && !modalOpen) {
            topOfPage.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            })
        }

        if (modalOpen) {
            hideModal()
        }
    }

    render() {
        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    modalOpen: selectIsModalOpen(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    hideModal: () => dispatch(hideModalAction()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalManager))
