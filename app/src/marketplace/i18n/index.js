// @flow

import merge from 'lodash/merge'
import pick from 'lodash/pick'
import sharedI18n from '$shared/i18n'

export default pick(merge(
    {},
    sharedI18n,
), ['en'])
