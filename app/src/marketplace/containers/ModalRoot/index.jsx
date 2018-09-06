// @flow

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectModalName, selectModalProps } from '../../modules/modals/selectors'
import { hideModal } from '../../modules/modals/actions'
import modals from '../../utils/modals'

import type { StoreState } from '../../flowtype/store-state'

type StateProps = {
    modalName: ?string,
    modalProps: ?Object,
}

type DispatchProps = {
    onClose: () => void,
}

type Props = StateProps & DispatchProps

export const mapStateToProps = (state: StoreState): StateProps => ({
    modalName: selectModalName(state),
    modalProps: selectModalProps(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    onClose: () => dispatch(hideModal()),
})

export const ModalRoot = ({ modalName, modalProps, onClose }: Props) => {
    if (modalName && Object.prototype.hasOwnProperty.call(modals, modalName)) {
        const Modal = modals[modalName]
        return <Modal onClose={onClose} {...modalProps} />
    }

    return null
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalRoot))
