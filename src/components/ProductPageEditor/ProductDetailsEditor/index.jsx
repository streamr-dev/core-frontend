// @flow

import React from 'react'
import { Button, Input, DropdownItem } from '@streamr/streamr-layout'

import PaymentRate from '../../PaymentRate'
import { timeUnits } from '../../../utils/constants'
import type { Product } from '../../../flowtype/product-types'
import type { Address } from '../../../flowtype/web3-types'
import type { PropertySetter } from '../../../flowtype/common-types'
import type { PriceDialogProps, PriceDialogResult } from '../../SetPriceDialog'
import type { Category, CategoryList } from '../../../flowtype/category-types'

import Dropdown from './Dropdown'
import styles from './ProductDetailsEditor.pcss'

type Props = {
    product: Product,
    category: ?Category,
    onEdit: PropertySetter<string | number>,
    ownerAddress: ?Address,
    openPriceDialog: (PriceDialogProps) => void,
    categories: CategoryList,
}

type State = {
    category: ?Category,
    pricePerSecond: ?number,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
}

class ProductDetailsEditor extends React.Component<Props, State> {
    state = {
        category: undefined,
        pricePerSecond: null,
        beneficiaryAddress: null,
        ownerAddress: null,
    }

    componentWillMount() {
        const { category, product: { pricePerSecond, beneficiaryAddress, ownerAddress } } = this.props

        this.setState({
            category,
            pricePerSecond,
            beneficiaryAddress,
            ownerAddress,
        })
    }

    componentWillReceiveProps({ category }: Props) {
        this.setState({
            category,
        })
    }

    onPriceDialogResult = ({ pricePerSecond, beneficiaryAddress, ownerAddress }: PriceDialogResult) => {
        const { onEdit } = this.props

        this.setState({
            pricePerSecond,
            beneficiaryAddress,
            ownerAddress,
        })

        onEdit('beneficiaryAddress', beneficiaryAddress || '')
        onEdit('pricePerSecond', pricePerSecond)
        onEdit('ownerAddress', ownerAddress || '')
    }

    onOpenPriceDialogClick = () => {
        const { openPriceDialog, product } = this.props
        const { pricePerSecond, beneficiaryAddress, ownerAddress } = this.state

        openPriceDialog({
            pricePerSecond,
            currency: product.priceCurrency,
            beneficiaryAddress,
            ownerAddress,
            onResult: this.onPriceDialogResult,
        })
    }

    onChangeCategory = (category: Category) => {
        this.setState({
            category,
        })
        this.props.onEdit('category', category.id)
    }

    render() {
        const { product, onEdit, categories } = this.props
        const { category } = this.state

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
                <Dropdown
                    type="text"
                    name="description"
                    id="description"
                    placeholder="description"
                    className={styles.dropdown}
                    title={
                        <span>{category ? category.name : 'Set a product category'} &#9662;</span>
                    }
                >
                    {categories.map((c) => (
                        <DropdownItem
                            key={c.id}
                            onClick={() => this.onChangeCategory(c)}
                        >
                            {c.name}
                        </DropdownItem>
                    ))}
                </Dropdown>
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
