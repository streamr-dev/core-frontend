// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'

import Toolbar from '../Toolbar'
import Hero from '../Hero'
import ImageUpload from '../ImageUpload'
import ProductDetailsEditor from '../ProductPageEditor/ProductDetailsEditor'
import StreamSelector from '../ProductPageEditor/StreamSelector'

import type { Props as DetailProps } from '../ProductPageEditor/StreamSelector'
import type { Product } from '../../flowtype/product-types'
import type { ButtonActions } from '../Buttons'
import styles from './createproductpage.pcss'

type StateProps = {
    product: Product,
    toolbarActions?: ButtonActions,
    toolbarStatus?: Node,
}

type DispatchProps = DetailProps & {
    setImageToUpload?: (File) => void,
    onChange: (field: string, value: string) => void,
    openPriceDialog: () => void,
    onCancel: () => void,
}

export type Props = StateProps & DispatchProps

const CreateProductPage = (props: Props) => {
    const {
        streams,
        fetchingStreams,
        toolbarActions,
        setImageToUpload,
        openPriceDialog,
        onChange,
        product,
    } = props

    return (
        <div className={styles.createProductPage}>
            <Button onClick={() => props.onCancel()}>Back</Button>
            <Toolbar actions={toolbarActions} />
            <Hero
                leftContent={<ImageUpload setImageToUpload={setImageToUpload} />}
                rightContent={<ProductDetailsEditor product={product} onEdit={onChange} openPriceDialog={openPriceDialog} />}
            />
            <StreamSelector streams={streams} fetchingStreams={fetchingStreams} />
        </div>
    )
}

export default CreateProductPage
