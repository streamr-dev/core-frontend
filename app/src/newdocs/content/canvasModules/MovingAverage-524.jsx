/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './MovingAverage-524.mdx'

export default {
  "id": 524,
  "name": "MovingAverage",
  "path": "Time Series: Filtering",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Input values"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "minSamples": "Minimum number of input values received before a value is output",
      "length": "Length of the sliding window, ie. the number of most recent input values to include in calculation"
    },
    "outputs": {
      "out": "The moving average"
    },
    "paramNames": [
      "length",
      "minSamples"
    ]
  }
}
