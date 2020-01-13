// @flow

import { compose } from 'redux'
import OnAutoCompleteDecorator from './OnAutoCompleteDecorator'
import OnCommitDecorator from './OnCommitDecorator'
import StatefulInputDecorator from './StatefulInputDecorator'
import ActionsDropdownDecorator from './ActionsDropdownDecorator'

export default compose(ActionsDropdownDecorator, OnAutoCompleteDecorator, OnCommitDecorator, StatefulInputDecorator)('input')
