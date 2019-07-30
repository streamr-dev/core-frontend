/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './RateLimit-217.mdx'

export default {
  "id": 217,
  "name": "RateLimit",
  "path": "Utils",
  "help": {
    "params": {
      "rate": "How many messages are let through in given time",
      "timeInMillis": "The time in milliseconds, in which the given number of messages are let through"
    },
    "paramNames": [
      "rate",
      "timeInMillis"
    ],
    "inputs": {
      "in": "Input"
    },
    "inputNames": [
      "in"
    ],
    "outputs": {
      "limitExceeded?": "Outputs 1 if the message was blocked and 0 if it wasn't",
      "out": "Outputs the input value if it wasn't blocked"
    },
    "outputNames": [
      "limitExceeded?",
      "out"
    ],
    "helpText": moduleDescription
  }
}
