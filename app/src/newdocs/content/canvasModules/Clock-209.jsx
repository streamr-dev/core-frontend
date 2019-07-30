/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './Clock-209.mdx'

export default {
  "id": 209,
  "name": "Clock",
  "path": "Time & Date",
  "help": {
    "params": {
      "format": "Format of the string date",
      "rate": "the rate of the interval",
      "unit": "the unit of the interval"
    },
    "paramNames": [
      "format",
      "rate",
      "unit"
    ],
    "inputs": {},
    "inputNames": [],
    "outputs": {
      "date": "String notation of the time and date",
      "timestamp": "unix timestamp"
    },
    "outputNames": [
      "date",
      "timestamp"
    ],
    "helpText": moduleDescription
  }
}
