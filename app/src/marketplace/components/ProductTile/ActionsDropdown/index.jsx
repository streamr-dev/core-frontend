// @flow

import React from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import Meatball from '$shared/components/Meatball'
import DropdownActions from '$shared/components/DropdownActions'
import type { ProductId, ProductState } from '$mp/flowtype/product-types'
import { productStates } from '$shared/utils/constants'

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
    <DropdownActions
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
        <DropdownActions.Item
            className={styles.item}
            onClick={() => (!!redirectToEditProduct && redirectToEditProduct(id || ''))}
        >
            <Translate value="actionsDropdown.edit" />
        </DropdownActions.Item>
        {(productState === productStates.DEPLOYED || productState === productStates.NOT_DEPLOYED) &&
            <DropdownActions.Item
                className={styles.item}
                onClick={() => (!!redirectToPublishProduct && redirectToPublishProduct(id || ''))}
            >
                {(productState === productStates.DEPLOYED) ?
                    <Translate value="actionsDropdown.unpublish" /> :
                    <Translate value="actionsDropdown.publish" />
                }
            </DropdownActions.Item>
        }
    </DropdownActions>
)
