// @flow

import React from 'react'
import BN from 'bignumber.js'
import { Input, DropdownItem } from '@streamr/streamr-layout'
import PaymentRate from '../../PaymentRate'
import { DEFAULT_CURRENCY, timeUnits } from '../../../utils/constants'
import { priceForTimeUnits, pricePerSecondFromTimeUnit } from '../../../utils/price'
import type { Product } from '../../../flowtype/product-types'
import type { Address } from '../../../flowtype/web3-types'
import type { Currency, NumberString, PropertySetter } from '../../../flowtype/common-types'
import type { PriceDialogProps, PriceDialogResult } from '../../Modal/SetPriceDialog'
import type { Category, CategoryList } from '../../../flowtype/category-types'
import type { User } from '../../../flowtype/user-types'

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
    user?: ?User,
}

type State = {
    category: ?Category,
    pricePerSecond: ?NumberString,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    priceCurrency: ?Currency,
}

class ProductDetailsEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const { category, product } = this.props
        const { pricePerSecond, beneficiaryAddress, ownerAddress, priceCurrency } = product

        this.state = {
            category,
            pricePerSecond,
            beneficiaryAddress,
            ownerAddress: ownerAddress || this.props.ownerAddress,
            priceCurrency: priceCurrency || DEFAULT_CURRENCY,
        }
    }

    componentDidMount() {
        if (this.title) {
            const { title } = this
            title.select()
            title.addEventListener('focus', () => this.onTitleFocus(title))
            title.addEventListener('click', () => this.onTitleFocus(title))
        }
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

    onOpenPriceDialogClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { openPriceDialog } = this.props
        const { pricePerSecond, beneficiaryAddress, ownerAddress, priceCurrency } = this.state
        e.preventDefault()

        return openPriceDialog({
            pricePerSecond,
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

    onTitleFocus = (titleElement: HTMLInputElement) => {
        const title = titleElement
        if (title.value === 'Name your product') {
            title.value = ''
        }
    }

    title: ?HTMLInputElement

    render() {
        const {
            product,
            onEdit,
            categories,
            isPriceEditable,
            user,
        } = this.props
        const { category, pricePerSecond, priceCurrency } = this.state

        return (
            <div className={styles.details}>
                <Input
                    autoFocus
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name your product"
                    defaultValue={product.name || 'Name your product'}
                    innerRef={(innerRef) => {
                        this.title = innerRef
                    }}
                    className={styles.titleField}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => onEdit('name', e.target.value)}
                />
                <div className={styles.section}>
                    <span className={styles.productOwner}>by {product.owner ? product.owner : (user && user.name)}</span>
                    <span className={styles.separator}>|</span>
                    <span>{product.isFree ? 'Free' : <PaymentRate
                        className={styles.paymentRate}
                        amount={pricePerSecond}
                        currency={priceCurrency || DEFAULT_CURRENCY}
                        timeUnit={timeUnits.hour}
                        maxDigits={4}
                    />}
                    </span>
                    {isPriceEditable && (<a className={styles.editPrice} href="#" onClick={(e) => this.onOpenPriceDialogClick(e)}>Edit price </a>)}
                </div>
                <Input
                    type="textarea"
                    name="description"
                    id="description"
                    placeholder="Write a brief description"
                    className={styles.productDescription}
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
                        <span>
                            {category ? category.name : 'Set a product category'}
                        </span>
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
            </div>
        )
    }
}

export default ProductDetailsEditor
