// @flow

import { connect } from 'react-redux'

import PreviewProductPage from '../../components/PreviewProductPage'
import { selectProduct, selectProductStreams } from '../../modules/createProduct/selectors'
import { createProductAndRedirect, setImageToUpload } from '../../modules/createProduct/actions'
import { formatPath } from '../../utils/url'

import type { StoreState } from '../../flowtype/store-state'
import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'

import links from '../../links'

type StateProps = {
    product: ?Product,
    streams: StreamList,
}

type DispatchProps = {
    onSave: () => void,
    onPublish: () => void,
    setImageToUpload: (File) => void,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectProductStreams(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    onSave: () => {
        dispatch(createProductAndRedirect((id) => formatPath(links.products, id)))
    },
    onPublish: () => {
        dispatch(createProductAndRedirect((id) => formatPath(links.products, id, 'publish')))
    },
    setImageToUpload: (image: File) => dispatch(setImageToUpload(image)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewProductPage)
