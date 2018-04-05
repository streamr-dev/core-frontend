// @flow

import React from 'react'
import { connect } from 'react-redux'
import { selectModalName, selectModalProps } from '../../modules/modals/selectors'
import { hideModal } from '../../modules/modals/actions'
import SetPriceDialog from '../../components/SetPriceDialog'

import type { StoreState } from '../../flowtype/store-state'

type StateProps = {
    modalName: ?string,
    modalProps: ?Object,
}

type DispatchProps = {
    onClose: () => void,
}

type Props = StateProps & DispatchProps

const mapStateToProps = (state: StoreState): StateProps => ({
    modalName: selectModalName(state),
    modalProps: selectModalProps(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    onClose: () => dispatch(hideModal()),
})

const MODAL_COMPONENTS = {
    SET_PRICE: SetPriceDialog,
}

const ModalRoot = ({ modalName, modalProps, onClose }: Props) => {
    if (modalName && Object.prototype.hasOwnProperty.call(MODAL_COMPONENTS, modalName)) {
        const SpecificModal = MODAL_COMPONENTS[modalName]
        return <SpecificModal onClose={onClose} {...modalProps} />
    }

    return null
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalRoot)
