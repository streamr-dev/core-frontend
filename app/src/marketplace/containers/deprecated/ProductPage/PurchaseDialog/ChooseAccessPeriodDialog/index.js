// @flow

import { connect } from 'react-redux'

import { selectDataPerUsd } from '$mp/modules/global/selectors'
import ChooseAccessPeriodDialog from '$mp/components/deprecated/ChooseAccessPeriodDialog'

const mapStateToProps = (state) => ({
    dataPerUsd: selectDataPerUsd(state),
})

export default connect(mapStateToProps)(ChooseAccessPeriodDialog)
