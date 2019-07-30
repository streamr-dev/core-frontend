/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './RandomNumber-562.mdx'

export default {
  "id": 562,
  "name": "RandomNumber",
  "path": "Time Series: Random",
  "help": {
    "params": {
      "min": "lower bound of interval to sample from",
      "max": "upper bound of interval to sample from"
    },
    "paramNames": [
      "min",
      "max"
    ],
    "inputs": {
      "trigger": "when value is received, activates module"
    },
    "inputNames": [
      "trigger"
    ],
    "outputs": {
      "out": "the random number"
    },
    "outputNames": [
      "out"
    ],
    "helpText": moduleDescription
  }
}
