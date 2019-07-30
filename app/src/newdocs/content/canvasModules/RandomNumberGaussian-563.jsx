/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './RandomNumberGaussian-563.mdx'

export default {
  "id": 563,
  "name": "RandomNumberGaussian",
  "path": "Time Series: Random",
  "help": {
    "params": {
      "mean": "mean of normal distribution",
      "sd": "standard deviation of normal distribution"
    },
    "paramNames": [
      "mean",
      "sd"
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
