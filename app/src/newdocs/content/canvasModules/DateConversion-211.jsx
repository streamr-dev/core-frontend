/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './DateConversion-211.mdx'

export default {
  "id": 211,
  "name": "DateConversion",
  "path": "Time & Date",
  "help": {
    "params": {
      "timezone": "Timezone of the outputs",
      "format": "Format of the input and output string notations"
    },
    "paramNames": [
      "timezone",
      "format"
    ],
    "inputs": {
      "date": "Timestamp, string or Date"
    },
    "inputNames": [
      "date"
    ],
    "outputs": {
      "date": "String notation",
      "ts": "Timestamp(ms)",
      "dayOfWeek": "In shortened form, e.g. \"Mon\""
    },
    "outputNames": [
      "date",
      "ts",
      "dayOfWeek"
    ],
    "helpText": moduleDescription
  }
}
