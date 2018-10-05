// @flow

import FormControl from '../FormControl'
import TextField from './TextField'

export default FormControl(TextField, ({ target }: SyntheticInputEvent<EventTarget>) => target.value)
