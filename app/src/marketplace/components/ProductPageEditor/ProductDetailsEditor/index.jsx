// @flow

import React from 'react'
import BN from 'bignumber.js'
import { Input } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import PaymentRate from '../../PaymentRate'
import { DEFAULT_CURRENCY, timeUnits } from '$shared/utils/constants'
import { priceForTimeUnits, pricePerSecondFromTimeUnit } from '$mp/utils/price'
import type { Product } from '$mp/flowtype/product-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { Currency, NumberString, PropertySetter } from '$shared/flowtype/common-types'
import type { PriceDialogProps, PriceDialogResult } from '$mp/components/Modal/SetPriceDialog'
import type { Category, CategoryList } from '$mp/flowtype/category-types'
import type { User } from '$shared/flowtype/user-types'
import DropdownActions from '$shared/components/DropdownActions'

import styles from './productDetailsEditor.pcss'

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
        if (title.value === I18n.t('productDetailsEditor.name')) {
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
                    placeholder={I18n.t('productDetailsEditor.name')}
                    defaultValue={product.name || I18n.t('productDetailsEditor.name')}
                    innerRef={(innerRef) => {
                        this.title = innerRef
                    }}
                    className={styles.titleField}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => onEdit('name', e.target.value)}
                />
                <div className={styles.section}>
                    <span className={styles.productOwner}>by {product.owner ? product.owner : (user && user.name)}</span>
                    <span className={styles.separator}>|</span>
                    {isPriceEditable ? (
                        <DropdownActions
                            className={styles.dropdown}
                            title={
                                <span>{product.isFree ? I18n.t('productDetailsEditor.free') : <PaymentRate
                                    className={styles.paymentRate}
                                    amount={pricePerSecond}
                                    currency={priceCurrency || DEFAULT_CURRENCY}
                                    timeUnit={timeUnits.hour}
                                    maxDigits={4}
                                />}
                                </span>
                            }
                        >
                            <DropdownActions.Item
                                key="setPrice"
                                onClick={(e) => this.onOpenPriceDialogClick(e)}
                            >
                                {product.id ? I18n.t('productDetailsEditor.editPrice') : I18n.t('productDetailsEditor.setPrice')}
                            </DropdownActions.Item>
                        </DropdownActions>
                    ) : (
                        <span>{product.isFree ? I18n.t('productDetailsEditor.free') : <PaymentRate
                            className={styles.paymentRate}
                            amount={pricePerSecond}
                            currency={priceCurrency || DEFAULT_CURRENCY}
                            timeUnit={timeUnits.hour}
                            maxDigits={4}
                        />}
                        </span>
                    )}
                </div>
                <DropdownActions
                    className={styles.dropdown}
                    title={
                        <span>
                            {category ? category.name : I18n.t('productDetailsEditor.category')}
                        </span>
                    }
                >
                    {categories.map((c) => (
                        <DropdownActions.Item
                            key={c.id}
                            onClick={() => this.onChangeCategory(c)}
                        >
                            {c.name}
                        </DropdownActions.Item>
                    ))}
                </DropdownActions>
                <Input
                    type="textarea"
                    name="description"
                    id="description"
                    placeholder={I18n.t('productDetailsEditor.description')}
                    className={styles.productDescription}
                    defaultValue={product.description}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => onEdit('description', e.target.value)}
                />
            </div>
        )
    }
}

export default ProductDetailsEditor
