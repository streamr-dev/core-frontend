// @flow

import React from 'react'
import { connect } from 'react-redux'

import { PURCHASE_DIALOG } from '../../utils/modals'
import PurchaseDialog from './PurchaseDialog'
import { selectModal } from '../../modules/ui/selectors'
import Overlay from '../../components/Modal/Overlay'
import type { ModalId } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'

type ModalComponents = {
    [ModalId]: any, // TODO: what should be the component type?
}

const MODAL_COMPONENTS: ModalComponents = {
    [PURCHASE_DIALOG]: PurchaseDialog,
}

type Props = {
    modal: ?ModalId,
}

class Modal extends React.Component<Props> {
    render() {
        const { modal } = this.props

        if (!modal) {
            return null
        }

        const ModalComponent = MODAL_COMPONENTS[modal]

        return (
            <Overlay>
                <ModalComponent />
            </Overlay>
        )
    }
}

const mapStateToProps = (state: StoreState) => ({
    modal: selectModal(state),
})

export default connect(mapStateToProps)(Modal)
