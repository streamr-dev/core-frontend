/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './FourZones-84.mdx'

export default {
  "id": 84,
  "name": "FourZones",
  "path": "Time Series: Triggers",
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
      "lowRelease": "Low release level",
      "highTrigger": "High trigger level",
      "lowTrigger": "Low trigger level",
      "highRelease": "High release level",
      "mode": "Trigger on entering/exiting the high/low trigger level"
    },
    "outputs": {
      "out": "1 on high trigger, -1 on low trigger, 0 on release"
    },
    "paramNames": [
      "mode",
      "highTrigger",
      "highRelease",
      "lowRelease",
      "lowTrigger"
    ]
  }
}
