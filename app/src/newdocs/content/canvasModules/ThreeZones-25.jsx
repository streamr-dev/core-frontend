/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './ThreeZones-25.mdx'

export default {
  "id": 25,
  "name": "ThreeZones",
  "path": "Time Series: Triggers",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Incoming value"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "highZone": "The high limit",
      "lowZone": "The low limit"
    },
    "outputs": {
      "out": "-1, 0 or +1 depending on which zone the input value is in"
    },
    "paramNames": [
      "highZone",
      "lowZone"
    ]
  }
}
