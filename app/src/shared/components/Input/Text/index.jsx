// @flow

import { compose } from 'redux'
import OnAutoCompleteDecorator from './OnAutoCompleteDecorator'
import OnCommitDecorator from './OnCommitDecorator'
import StatefulInputDecorator from './StatefulInputDecorator'

export default compose(OnAutoCompleteDecorator, OnCommitDecorator, StatefulInputDecorator)('input')
