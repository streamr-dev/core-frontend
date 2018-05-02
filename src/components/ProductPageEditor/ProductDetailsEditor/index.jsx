// @flow

import React from 'react'
import BN from 'bignumber.js'
import { Button, Input, DropdownItem } from '@streamr/streamr-layout'
import PaymentRate from '../../PaymentRate'
import { DEFAULT_CURRENCY, timeUnits } from '../../../utils/constants'
import { priceForTimeUnits, pricePerSecondFromTimeUnit } from '../../../utils/price'
import type { Product } from '../../../flowtype/product-types'
import type { Address } from '../../../flowtype/web3-types'
import type { Currency, NumberString, PropertySetter } from '../../../flowtype/common-types'
import type { PriceDialogProps, PriceDialogResult } from '../../Modal/SetPriceDialog'
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
    isPriceEditable: boolean,
}

type State = {
    category: ?Category,
    pricePerSecond: ?NumberString,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    priceCurrency: ?Currency,
}

class ProductDetailsEditor extends React.Component<Props, State> {
    state = {
        category: undefined,
        pricePerSecond: null,
        beneficiaryAddress: null,
        ownerAddress: null,
        priceCurrency: null,
    }

    componentWillMount() {
        const { category, product: { pricePerSecond, beneficiaryAddress, ownerAddress, priceCurrency } } = this.props

        this.setState({
            category,
            pricePerSecond,
            beneficiaryAddress,
            ownerAddress: ownerAddress || this.props.ownerAddress,
            priceCurrency: priceCurrency || DEFAULT_CURRENCY,
        })
    }

    componentWillReceiveProps({ category, ownerAddress }: Props) {
        this.setState({
            category,
            ownerAddress: this.state.ownerAddress || ownerAddress,
        })
    }

    onPriceDialogResult = ({
        amount,
        timeUnit,
        beneficiaryAddress,
        ownerAddress,
        priceCurrency,
    }: PriceDialogResult) => {
        const { onEdit } = this.props

        const pricePerSecond = pricePerSecondFromTimeUnit(amount || BN(0), timeUnit).toString()

        this.setState({
            pricePerSecond,
            beneficiaryAddress,
            ownerAddress,
            priceCurrency,
        })

        onEdit('beneficiaryAddress', beneficiaryAddress || '')
        onEdit('pricePerSecond', pricePerSecond)
        onEdit('priceCurrency', priceCurrency)
        onEdit('ownerAddress', ownerAddress || '')
    }

    onOpenPriceDialogClick = () => {
        const { openPriceDialog } = this.props
        const { pricePerSecond, beneficiaryAddress, ownerAddress, priceCurrency } = this.state

        openPriceDialog({
            startingAmount: priceForTimeUnits(pricePerSecond || '0', 1, timeUnits.hour).toString(),
            currency: priceCurrency || DEFAULT_CURRENCY,
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
        const { product, onEdit, categories, isPriceEditable } = this.props
        const { category, priceCurrency } = this.state

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
                    amount={this.state.pricePerSecond || BN(0)}
                    currency={priceCurrency || product.priceCurrency}
                    timeUnit={timeUnits.hour}
                    maxDigits={4}
                />
                {isPriceEditable &&
                    <Button color="primary" onClick={this.onOpenPriceDialogClick}>Set price</Button>
                }
            </div>
        )
    }
}

export default ProductDetailsEditor
