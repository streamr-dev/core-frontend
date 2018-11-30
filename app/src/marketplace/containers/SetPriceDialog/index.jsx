// @flow

import { connect } from 'react-redux'

import SetPriceDialog from '$mp/components/Modal/SetPriceDialog'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import withContractProduct from '$mp/containers/WithContractProduct'

const mapStateToProps = (state) => ({
    dataPerUsd: selectDataPerUsd(state),
})

export default connect(mapStateToProps)(withContractProduct(SetPriceDialog))
