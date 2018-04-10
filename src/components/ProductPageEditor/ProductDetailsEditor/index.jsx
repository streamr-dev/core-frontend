// @flow

import React from 'react'
import { Button, Input } from '@streamr/streamr-layout'
import styles from './ProductDetailsEditor.pcss'
import PaymentRate from '../../PaymentRate'
import type { Product } from '../../../flowtype/product-types'
import type { Address } from '../../../flowtype/web3-types'
import type { PropertySetter, Currency } from '../../../flowtype/common-types'

type OwnProps = {
    product: Product,
    onEdit: PropertySetter<string | number>,
}

export type StateProps = {
    ownerAddress: ?Address,
    draft: Product,
}

export type DispatchProps = {
    openPriceDialog: (?number, Currency, ?Address, ?Address, PropertySetter<string | number>) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class ProductDetailsEditor extends React.Component<Props> {
    onOpenPriceDialogClick = () => {
        const { openPriceDialog, product, ownerAddress, onEdit } = this.props
        openPriceDialog(this.pricePerSecond(), product.priceCurrency, this.beneficiaryAddress(), ownerAddress, onEdit)
    }

    pricePerSecond = (): ?number => {
        const { draft, product } = this.props
        return typeof draft.pricePerSecond === 'number' ? draft.pricePerSecond : product.pricePerSecond
    }

    beneficiaryAddress = (): ?Address => {
        const { draft, product, ownerAddress } = this.props
        return draft.beneficiaryAddress || product.beneficiaryAddress || ownerAddress
    }

    render() {
        const { product, onEdit } = this.props

        return (
            <div className={styles.details}>
                <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="name"
                    defaultValue={product.name}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => onEdit('name', e.target.value)}
                />
                <Input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="description"
                    defaultValue={product.description}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => onEdit('description', e.target.value)}
                />
                <Button color="primary">Get Streams</Button>
                <PaymentRate
                    amount={this.pricePerSecond() || 0.0}
                    currency={product.priceCurrency}
                    timeUnit="second"
                    maxDigits={4}
                />
                <Button color="primary" onClick={this.onOpenPriceDialogClick}>Set price</Button>
            </div>
        )
    }
}

export default ProductDetailsEditor
