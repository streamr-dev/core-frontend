// @flow

import React from 'react'
import { connect } from 'react-redux'
import qs from 'query-string'
import { getDefaultLocale } from '$shared/utils/locale'
import { applyLocale as applyLocaleAction } from '$app/src/marketplace/modules/locale/actions'
import { withRouter } from 'react-router-dom'
import type { Locale } from '$app/src/marketplace/modules/locale/types'

import withI18n, { type I18nProps } from '../WithI18n'
import i18n from '../../i18n'

const localeList = Object.keys(i18n)

type DispatchProps = {
    applyLocale: (locale: ?Locale, localeList: Array<Locale>, defaultLocale: string) => void,
}

type Props = I18nProps & DispatchProps & {
    location: {
        search: string,
    },
}

class LocaleSetter extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
        this.apply()
    }

    componentDidUpdate() {
        this.apply()
    }

    apply() {
        const { locale, location: { search } } = this.props
        const { lang: newLocale } = qs.parse(search)
        const sanitized = {
            locale: getDefaultLocale(locale, localeList),
            newLocale: getDefaultLocale(newLocale, localeList),
        }
        if (locale !== sanitized.newLocale) {
            this.props.applyLocale(sanitized.newLocale, localeList, 'en')
        } else if (locale !== sanitized.locale) {
            this.props.applyLocale(sanitized.locale, localeList, 'en')
        }
    }

    render() {
        return null
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    applyLocale: (locale: ?Locale, locales: Array<Locale>, defaultLocale: string = 'en') => {
        dispatch(applyLocaleAction(locale, locales, defaultLocale))
    },
})

export default withRouter(connect(null, mapDispatchToProps)(withI18n(LocaleSetter))) // TODO: prevent double connecting of LocaleSetter
