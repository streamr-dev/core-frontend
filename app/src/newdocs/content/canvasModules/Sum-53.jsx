/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Sum-53.mdx'

export default {
  "id": 53,
  "name": "Sum",
  "path": "Time Series: Simple Math",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Values to be summed"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "minSamples": "How many values must exist in the window before outputting a value",
      "windowLength": "Length of the sliding window of values to be summed, or 0 for infinite"
    },
    "outputs": {
      "out": "Sum of values in the window"
    },
    "paramNames": [
      "windowLength",
      "minSamples"
    ]
  }
}
