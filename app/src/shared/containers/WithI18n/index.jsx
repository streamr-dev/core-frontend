// @flow

import React, { type ComponentType } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import type { StoreState, I18nState, Translations, Locale } from '$shared/flowtype/store-state'

type StateProps = {
    locale: Locale,
    language: string,
    translations: Translations,
}

type DispatchProps = {
    translate: (key: string, options: any) => string,
}

type Props = StateProps & DispatchProps

export type I18nProps = Props

const selectI18nState = (state: StoreState): I18nState => state.i18n

const selectLocale: (StoreState) => Locale = createSelector(
    selectI18nState,
    (subState: I18nState): Locale => subState.locale,
)

const selectTranslations: (StoreState) => Translations = createSelector(
    selectI18nState,
    (subState: I18nState): Translations => subState.translations || {},
)

export function withI18n(WrappedComponent: ComponentType<any>) {
    const mapStateToProps = (state): StateProps => {
        const locale = selectLocale(state)
        const translations = selectTranslations(state)
        const language: string = (typeof translations[locale] === 'object' && translations[locale].language.name) || 'English'

        return {
            locale,
            language,
            translations,
        }
    }

    const WithI18n = (props: Props) =>
        <WrappedComponent {...props} />

    return connect(mapStateToProps)(WithI18n)
}

export default withI18n
