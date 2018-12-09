// @flow

/**
 * ModalManager is gonna be obsolete when we start using the new modals. It
 * keeps track of the route changes, hides modals and scrolls to the top of
 * the page if a change happened.
 *
 * The new modals remove themself from DOM if a route changes automatically,
 * and the new AutoScroll component scrolls to the top of the page w/o
 * keeping track on extra deps.
 *
 * Cheers,
 * Mariusz
 */

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
