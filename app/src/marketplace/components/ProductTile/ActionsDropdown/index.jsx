// @flow

import React from 'react'
import cx from 'classnames'
import { DropdownItem } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import Meatball from '$shared/components/Meatball'
import Dropdown from '../../ProductPageEditor/ProductDetailsEditor/Dropdown'
import type { ProductId, ProductState } from '../../../flowtype/product-types'
import { productStates } from '../../../utils/constants'

import styles from './actionsDropdown.pcss'

type Props = {
    className?: string,
    redirectToEditProduct?: (id: ProductId) => void,
    redirectToPublishProduct?: (id: ProductId) => void,
    productState: ?ProductState,
    id: ?ProductId,
}

export const ActionsDropdown = ({
    className,
    redirectToEditProduct,
    redirectToPublishProduct,
    productState,
    id,
}: Props) => (
    <Dropdown
        className={cx(styles.root, className)}
        toggleProps={{
            className: styles.toggle,
        }}
        menuProps={{
            className: styles.menu,
        }}
        title={
            <Meatball white alt={I18n.t('actionsDropdown.caption')} />
        }
        noCaret
    >
        <DropdownItem
            className={styles.item}
            onClick={() => (!!redirectToEditProduct && redirectToEditProduct(id || ''))}
        >
            <Translate value="actionsDropdown.edit" />
        </DropdownItem>
        {(productState === productStates.DEPLOYED || productState === productStates.NOT_DEPLOYED) &&
            <DropdownItem
                className={styles.item}
                onClick={() => (!!redirectToPublishProduct && redirectToPublishProduct(id || ''))}
            >
                {(productState === productStates.DEPLOYED) ?
                    <Translate value="actionsDropdown.unpublish" /> :
                    <Translate value="actionsDropdown.publish" />
                }
            </DropdownItem>
        }
    </Dropdown>
)
