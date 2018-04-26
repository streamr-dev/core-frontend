// @flow

import React from 'react'

import NoProductsBaseView from '../NoProductsBaseView'

const NoProductsView = () => (
    <NoProductsBaseView>
        <p>We couldn’t find anything to match your search</p>
        <small>Please try again with more general terms.</small>
    </NoProductsBaseView>
)

export default NoProductsView
