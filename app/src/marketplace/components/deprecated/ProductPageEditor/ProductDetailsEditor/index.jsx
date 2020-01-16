// @flow

import React from 'react'
import BN from 'bignumber.js'
import { Input } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import SetPriceDialog from '$mp/containers/deprecated/SetPriceDialog'
import PaymentRate from '$mp/components/PaymentRate'
import { DEFAULT_CURRENCY, timeUnits } from '$shared/utils/constants'
import { priceForTimeUnits, pricePerSecondFromTimeUnit } from '$mp/utils/price'
import type { Product } from '$mp/flowtype/product-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { ContractCurrency, NumberString, PropertySetter } from '$shared/flowtype/common-types'
import type { PriceDialogResult } from '$mp/components/Modal/SetPriceDialog'
import type { Category, CategoryList } from '$mp/flowtype/category-types'
import type { User } from '$shared/flowtype/user-types'
import DropdownActions from '$shared/components/DropdownActions'

import styles from './productDetailsEditor.pcss'

type Props = {
    product: Product,
    category: ?Category,
    onEdit: PropertySetter<string | number>,
    ownerAddress: ?Address,
    categories: CategoryList,
    isPriceEditable: boolean,
    user?: ?User,
}

type State = {
    category: ?Category,
    pricePerSecond: ?NumberString,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    priceCurrency: ?ContractCurrency,
    setPriceDialogOpen: boolean,
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
            setPriceDialogOpen: false,
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
        e.preventDefault()
        this.setState({
            setPriceDialogOpen: true,
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

    closePriceDialog = () => {
        this.setState({
            setPriceDialogOpen: false,
        })
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
        const {
            category,
            pricePerSecond,
            priceCurrency,
            setPriceDialogOpen,
            beneficiaryAddress,
            ownerAddress,
        } = this.state

        /**
         * FIXME: SetPriceDialog component down the tree declares 2 callbacks: onClose and
         *        onCancel. We should need just 1! Dialogs are gonna use onClose. Let's
         *        rename onCancel and onDismiss (that's another one in use!) to onClose,
         *        which seems to be the most generic. — Mariusz
         */
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
                {setPriceDialogOpen && (
                    <SetPriceDialog
                        beneficiaryAddress={beneficiaryAddress}
                        currency={priceCurrency || DEFAULT_CURRENCY}
                        isFree={product.isFree}
                        onClose={this.closePriceDialog}
                        onCancel={this.closePriceDialog}
                        onResult={this.onPriceDialogResult}
                        ownerAddress={ownerAddress}
                        pricePerSecond={pricePerSecond}
                        productId={product.id}
                        requireOwnerIfDeployed
                        startingAmount={priceForTimeUnits(pricePerSecond || '0', 1, timeUnits.hour).toString()}
                    />
                )}
            </div>
        )
    }
}

export default ProductDetailsEditor
