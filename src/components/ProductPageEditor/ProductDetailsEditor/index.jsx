// @flow

import React from 'react'
import { Button, Input } from '@streamr/streamr-layout'

import PaymentRate from '../../PaymentRate'
import { timeUnits } from '../../../utils/constants'
import type { Product } from '../../../flowtype/product-types'
import type { Address } from '../../../flowtype/web3-types'
import type { PropertySetter } from '../../../flowtype/common-types'
import type { PriceDialogProps, PriceDialogResult } from '../../SetPriceDialog'

import styles from './ProductDetailsEditor.pcss'

type Props = {
    product: Product,
    onEdit: PropertySetter<string | number>,
    ownerAddress: ?Address,
    openPriceDialog: (PriceDialogProps) => void,
}

type State = {
    pricePerSecond: ?number,
    beneficiaryAddress: ?Address,
}

class ProductDetailsEditor extends React.Component<Props, State> {
    state = {
        pricePerSecond: null,
        beneficiaryAddress: null,
    }

    componentWillMount() {
        const { product: { pricePerSecond, beneficiaryAddress } } = this.props

        this.setState({
            pricePerSecond,
            beneficiaryAddress,
        })
    }

    onPriceDialogResult = ({ pricePerSecond, beneficiaryAddress }: PriceDialogResult) => {
        const { onEdit } = this.props

        this.setState({
            pricePerSecond,
            beneficiaryAddress,
        })

        onEdit('beneficiaryAddress', beneficiaryAddress || '')
        onEdit('pricePerSecond', pricePerSecond)
    }

    onOpenPriceDialogClick = () => {
        const { openPriceDialog, product, ownerAddress } = this.props
        const { pricePerSecond, beneficiaryAddress } = this.state

        openPriceDialog({
            pricePerSecond,
            currency: product.priceCurrency,
            beneficiaryAddress,
            ownerAddress,
            onResult: this.onPriceDialogResult,
        })
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
                    amount={this.state.pricePerSecond || 0.0}
                    currency={product.priceCurrency}
                    timeUnit={timeUnits.second}
                    maxDigits={4}
                />
                <Button color="primary" onClick={this.onOpenPriceDialogClick}>Set price</Button>
            </div>
        )
    }
}

export default ProductDetailsEditor
