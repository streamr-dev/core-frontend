// @flow

import React from 'react'
import qs from 'query-string'
import { applyLocale, getDefaultLocale } from '$shared/utils/locale'
import { withRouter } from 'react-router-dom'

import withI18n, { type I18nProps } from '$shared/containers/WithI18n'
import i18n from '../../i18n'
import store from '../../../store'

const localeList = Object.keys(i18n)

type Props = I18nProps & {
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
            applyLocale(store, sanitized.newLocale, localeList, 'en')
        } else if (locale !== sanitized.locale) {
            applyLocale(store, sanitized.locale, localeList, 'en')
        }
    }

    render() {
        return null
    }
}

export default withRouter(withI18n(LocaleSetter))
