/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './MovingWindow-570.mdx'

export default {
  "id": 570,
  "name": "MovingWindow",
  "path": "Utils",
  "help": {
    "params": {
      "windowLength": "Length of the sliding window, ie. the number of most recent input values to include in calculation",
      "windowType": "behavior of window",
      "minSamples": "Minimum number of input values received before a value is output"
    },
    "paramNames": [
      "windowLength",
      "windowType",
      "minSamples"
    ],
    "inputs": {
      "in": "values of any type"
    },
    "inputNames": [
      "in"
    ],
    "outputs": {
      "list": "the window's current state as a list"
    },
    "outputNames": [
      "list"
    ],
    "helpText": moduleDescription
  }
}
