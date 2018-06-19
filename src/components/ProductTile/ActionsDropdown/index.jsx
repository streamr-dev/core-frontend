// @flow

import React from 'react'
import { DropdownItem } from 'reactstrap'

import Dropdown from '../../ProductPageEditor/ProductDetailsEditor/Dropdown'
import type { ProductId, ProductState } from '../../../flowtype/product-types'
import { productStates } from '../../../utils/constants'

import styles from '../productTile.pcss'

type Props = {
    redirectToEditProduct?: (id: ProductId) => void,
    redirectToPublishProduct?: (id: ProductId) => void,
    productState: ?ProductState,
    id: ?ProductId,
}

export const ActionsDropdown = ({ redirectToEditProduct, redirectToPublishProduct, productState, id }: Props) => (
    <Dropdown
        className={styles.dropdown}
        title={
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="6"
                alt="Actions"
            >
                <g fill="#FFF">
                    <circle cx="3" cy="3" r="3" />
                    <circle cx="13" cy="3" r="3" />
                    <circle cx="23" cy="3" r="3" />
                </g>
            </svg>
        }
    >
        <DropdownItem onClick={() => (!!redirectToEditProduct && redirectToEditProduct(id || ''))}>
            Edit
        </DropdownItem>
        {(productState === productStates.DEPLOYED || productState === productStates.NOT_DEPLOYED) &&
            <DropdownItem onClick={() => (!!redirectToPublishProduct && redirectToPublishProduct(id || ''))}>
                {(productState === productStates.DEPLOYED) ? 'Unpublish' : 'Publish'}
            </DropdownItem>
        }
    </Dropdown>
)
