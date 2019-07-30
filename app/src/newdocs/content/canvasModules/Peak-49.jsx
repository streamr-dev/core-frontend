/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Peak-49.mdx'

export default {
  "id": 49,
  "name": "Peak",
  "path": "Time Series: Triggers",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {
      "in": "Input time series"
    },
    "helpText": moduleDescription,
    "inputNames": [
      "in"
    ],
    "params": {
      "highZone": "The level above which a downward turn can occur",
      "lowZone": "The level below which an upward turn can occur",
      "threshold": "The minimum change in the correct direction between subsequent input values that is allowed to trigger a turn"
    },
    "outputs": {
      "out": "1 for upward turn and -1 for downward turn"
    },
    "paramNames": [
      "highZone",
      "lowZone",
      "threshold"
    ]
  }
}
