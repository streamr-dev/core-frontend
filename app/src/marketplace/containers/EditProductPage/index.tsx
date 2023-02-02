import React from 'react'
import { withRouter } from 'react-router-dom'
import CoreLayout from '$shared/components/Layout/Core'
import * as UndoContext from '$shared/contexts/Undo'
import Toolbar from '$shared/components/Toolbar'
import type { Project } from '$mp/types/project-types'
import SwitchNetworkModal from '$shared/components/SwitchNetworkModal'
import ProductController from '../ProductController'
import styles from './editProductPage.pcss'

const EditProductPage = ({ product }: { product: Project }) => {

    return (
        <>
            <p>Edit page to be rewritten</p>
        </>
    )
}

const LoadingView = () => <CoreLayout className={styles.layout} nav={false} navComponent={<Toolbar loading actions={{}} altMobileLayout />} />

const EditWrap = () => {

    /*if (CONDITION) {
        return <LoadingView />
    }*/

    return (
        <>
            <EditProductPage key={null} product={null} />
            <SwitchNetworkModal />
        </>
    )
}

const ProductContainer = withRouter((props) => (
    <UndoContext.Provider key={props.match.params.id}>
        <ProductController>
            <EditWrap />
        </ProductController>
    </UndoContext.Provider>
))
export default ProductContainer
