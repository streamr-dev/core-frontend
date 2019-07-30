/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './TimeOfDay-60.mdx'

export default {
  "id": 60,
  "name": "TimeOfDay",
  "path": "Time & Date",
  "help": {
    "outputNames": [
      "out"
    ],
    "inputs": {},
    "helpText": moduleDescription,
    "inputNames": [],
    "params": {
      "startTime": "24 hour format HH:MM:SS",
      "endTime": "24 hour format HH:MM:SS"
    },
    "outputs": {
      "out": "1 between the given times, otherwise 0"
    },
    "paramNames": [
      "startTime",
      "endTime"
    ]
  }
}
