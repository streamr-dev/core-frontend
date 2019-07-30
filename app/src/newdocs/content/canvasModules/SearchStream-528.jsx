/* eslint-disable quotes, quote-props, indent, comma-dangle, max-len */
import moduleDescription from './SearchStream-528.mdx'

export default {
  "id": 528,
  "name": "SearchStream",
  "path": "Streams",
  "help": {
    "params": {},
    "paramNames": [],
    "inputs": {
      "name": "stream to search for by name, must be exact"
    },
    "inputNames": [
      "name"
    ],
    "outputs": {
      "found": "true if stream was found",
      "stream": "id of stream if found"
    },
    "outputNames": [
      "found",
      "stream"
    ],
    "helpText": moduleDescription
  }
}
