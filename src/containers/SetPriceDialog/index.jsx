// @flow

import { connect } from 'react-redux'

import { selectDataPerUsd } from '../../modules/global/selectors'
import SetPriceDialog from '../../components/Modal/SetPriceDialog'
import withWeb3 from '../WithWeb3'

const mapStateToProps = (state) => ({
    dataPerUsd: selectDataPerUsd(state),
})

export default connect(mapStateToProps)(withWeb3(SetPriceDialog, true))
