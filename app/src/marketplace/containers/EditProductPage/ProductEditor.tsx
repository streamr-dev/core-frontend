import React from 'react'
import cx from 'classnames'
import { isDataUnionProduct, isPaidProject } from '$mp/utils/product'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { projectStates } from '$shared/utils/constants'
import { projectTypes } from '$mp/utils/constants'
import { ProjectPageContainer } from '$shared/components/ProjectPage'
import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import ProductChain from './ProductChain'
import ProductStreams from './ProductStreams'
import PriceSelector from './PriceSelector'
import PaymentToken from './PaymentToken'
import ProductType from './ProductType'
import ProductBeneficiary from './ProductBeneficiary'
import ProductDetails from './ProductDetails'
import SharedSecrets from './SharedSecrets'
import TermsOfUse from './TermsOfUse'
import DataUnionDeployment from './DataUnionDeployment'
import styles from './editor.pcss'

type Props = {
    disabled?: boolean
}

/**
 * @deprecated
 * @param disabled
 * @constructor
 */
const ProductEditor = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const isDataUnion = isDataUnionProduct(product)
    const isPaid = isPaidProject(product)
    const isChainSelectorDisabled =
        product.state === projectStates.DEPLOYED ||
        (product.type === projectTypes.DATAUNION && product.beneficiaryAddress != null)
    return (
        <div className={cx(styles.root, styles.Editor)}>
            <ProjectPageContainer>
                <div className={styles.grid}>
                    <div className={styles.nav}>
                        <EditorNav />
                    </div>
                    <div className={styles.info}>
                        <ProductName disabled={disabled} />
                        <CoverImage disabled={disabled} />
                        <ProductDescription disabled={disabled} />
                        <ProductStreams disabled={disabled} />
                        <ProductType disabled={disabled} />
                        {(isDataUnion || isPaid) && (
                            <ProductChain disabled={disabled || isChainSelectorDisabled} />
                        )}
                        {(isDataUnion && !isChainSelectorDisabled) && (
                            <DataUnionDeployment
                                // NOTE: We want to remount component when chain changes
                                // so that we reset the list of selectable data unions.
                                key={`${product.id}-${product.chain}`}
                                disabled={disabled}
                            />
                        )}
                        {isPaid && (
                            <React.Fragment>
                                <PaymentToken disabled={disabled} />
                                <PriceSelector disabled={disabled} />
                                {!isDataUnion && <ProductBeneficiary disabled={disabled} />}
                            </React.Fragment>
                        )}
                        <ProductDetails disabled={disabled} />
                        <TermsOfUse disabled={disabled} />
                        {!!isDataUnion && <SharedSecrets disabled={disabled} />}
                    </div>
                </div>
            </ProjectPageContainer>
        </div>
    )
}

export default ProductEditor
