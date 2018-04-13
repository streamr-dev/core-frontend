// @flow

import React from 'react'
import { Button } from '@streamr/streamr-layout'

import Toolbar from '../Toolbar'
import Hero from '../Hero'
import ImageUpload from '../ImageUpload'
import ProductDetailsEditor from '../ProductPageEditor/ProductDetailsEditor'
import StreamSelector from '../ProductPageEditor/StreamSelector'
import type { Props as DetailProps } from '../ProductPageEditor/StreamSelector'
import type { PriceDialogProps } from '../SetPriceDialog'
import type { Product } from '../../flowtype/product-types'
import type { ButtonActions } from '../Buttons'
import type { Address } from '../../flowtype/web3-types'
import type { PropertySetter } from '../../flowtype/common-types'

import styles from './createproductpage.pcss'

type StateProps = {
    product: Product,
    toolbarActions?: ButtonActions,
    toolbarStatus?: Node,
}

type DispatchProps = DetailProps & {
    setImageToUpload?: (File) => void,
    onEdit: PropertySetter<string | number>,
    ownerAddress: ?Address,
    openPriceDialog: (PriceDialogProps) => void,
    onCancel: () => void,
}

export type Props = StateProps & DispatchProps

const CreateProductPage = (props: Props) => {
    const {
        streams,
        fetchingStreams,
        availableStreams,
        toolbarActions,
        setImageToUpload,
        openPriceDialog,
        ownerAddress,
        onEdit,
        product,
    } = props

    return (
        <div className={styles.createProductPage}>
            <Button onClick={() => props.onCancel()}>Back</Button>
            <Toolbar actions={toolbarActions} />
            <Hero
                leftContent={<ImageUpload setImageToUpload={setImageToUpload} />}
                rightContent={<ProductDetailsEditor
                    product={product}
                    ownerAddress={ownerAddress}
                    onEdit={onEdit}
                    openPriceDialog={openPriceDialog}
                />}
            />
            <StreamSelector
                streams={streams}
                availableStreams={availableStreams}
                fetchingStreams={fetchingStreams}
            />
        </div>
    )
}

export default CreateProductPage
