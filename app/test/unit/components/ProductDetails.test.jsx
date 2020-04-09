import React from 'react'
import { shallow } from 'enzyme'

import { productStates } from '$shared/utils/constants'
import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import ExpirationCounter from '$mp/components/ExpirationCounter'

describe('Product Details', () => {
    let wrapper
    let props

    const product = {
        id: 'product-1',
        name: 'Product 1',
        state: productStates.DEPLOYED,
    }

    props = {
        product,
        isValidSubscription: true,
        productSubscription: {
            productId: 'product-1',
            endTimestamp: 1,
        },
        onPurchase: () => {},
    }

    it('must not show the ExpirationCounter when the product has never been bought by the logged in user', () => {
        props = {
            ...props,
            productSubscription: {
                productId: 'product-1',
                endTimestamp: 0,
            },
        }
        wrapper = shallow(<ProductDetails {...props} />)
        expect(wrapper.find(ExpirationCounter)).toHaveLength(0)
    })

    it('must not show the ExpirationCounter when the product subscription status is unreachable (no Ethereum node access)', () => {
        props = {
            ...props,
            productSubscription: null,
        }
        wrapper = shallow(<ProductDetails {...props} />)
        expect(wrapper.find(ExpirationCounter)).toHaveLength(0)
    })

    it('must show the ExpirationCounter when the product has been bought by the logged in user and that subscription is in the past ', () => {
        props = {
            ...props,
            productSubscription: {
                productId: 'product-1',
                endTimestamp: 123,
            },
        }
        wrapper = shallow(<ProductDetails {...props} />)
        expect(wrapper.find(ExpirationCounter)).toHaveLength(1)
    })

    it('must show the ExpirationCounter when the product has been bought by the logged in user and has an active subscription', () => {
        props = {
            ...props,
            productSubscription: {
                productId: 'product-1',
                endTimestamp: 9586609689,
            },
        }
        wrapper = shallow(<ProductDetails {...props} />)
        expect(wrapper.find(ExpirationCounter)).toHaveLength(1)
    })
})
