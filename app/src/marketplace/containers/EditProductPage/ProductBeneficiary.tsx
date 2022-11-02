import React from 'react'
import cx from 'classnames'
import { usePending } from '$shared/hooks/usePending'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import BeneficiaryAddress from './BeneficiaryAddress'
import styles from './PriceSelector.pcss'
type Props = {
    disabled?: boolean
}

const ProductBeneficiary = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { updateBeneficiaryAddress } = useEditableProductActions()
    const { isPending: contractProductLoadPending } = usePending('contractProduct.LOAD')
    const isDisabled = !!(disabled || contractProductLoadPending)
    const isFreeProduct = !!product.isFree
    return (
        <section id="beneficiary" className={cx(styles.root, styles.PriceSelector)}>
            <div>
                <h1>Set beneficiary</h1>
                <p>This wallet address receives the payments for this product on the selected chain.</p>
                <BeneficiaryAddress
                    address={product.beneficiaryAddress}
                    onChange={updateBeneficiaryAddress}
                    disabled={isFreeProduct || isDisabled}
                />
            </div>
        </section>
    )
}

export default ProductBeneficiary
