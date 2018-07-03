// @flow

import React, { type ComponentType } from 'react'
import { connect } from 'react-redux'
import { I18n } from '@streamr/streamr-layout'
import { createSelector } from 'reselect'

import type { StoreState, I18nState } from '../../flowtype/store-state'

type StateProps = {
    locale: string,
}

type DispatchProps = {
    translate: (key: string, options: any) => string,
}

type Props = StateProps & DispatchProps

const selectI18nState = (state: StoreState): I18nState => state.i18n

const selectLocale: (StoreState) => string = createSelector(
    selectI18nState,
    (subState: I18nState): string => subState.locale,
)

export function withI18n(WrappedComponent: ComponentType<any>) {
    const mapStateToProps = (state): StateProps => ({
        locale: selectLocale(state),
    })

    const mapDispatchToProps = (): DispatchProps => ({
        translate: (key, options) => I18n.t(key, options),
    })

    const WithI18n = (props: Props) =>
        <WrappedComponent {...props} />

    return connect(mapStateToProps, mapDispatchToProps)(WithI18n)
}

export default withI18n
